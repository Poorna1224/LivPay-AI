from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import timedelta
import re
import uuid
from app.database import get_db
from app.models.user import User, UserRole
from app.models.policy import Policy
from app.models.trigger import Trigger
from app.models.notification import Notification
from app.schemas.user import AdminAccessRequest, AdminCreate, AdminLoginRequest, UserCreate, UserResponse, LoginRequest, TokenResponse
from app.auth import verify_password, get_password_hash, create_access_token, get_current_user
from app.services.premium_service import calculate_premium

router = APIRouter(prefix="/auth", tags=["Authentication"])

ACCESS_TOKEN_EXPIRE_MINUTES = 1440


def seed_worker_starter_data(user: User, db: Session) -> None:
    existing_policy = db.query(Policy).filter(Policy.user_id == user.id).first()
    existing_trigger = db.query(Trigger).filter(Trigger.user_id == user.id).first()
    existing_notification = db.query(Notification).filter(Notification.user_id == user.id).first()

    premium_data = calculate_premium(
        city=user.city,
        zone=user.zone,
        weekly_income=user.weekly_income,
    )

    if not existing_policy:
        db.add(
            Policy(
                user_id=user.id,
                weekly_premium=premium_data["weekly_premium"],
                coverage_amount=premium_data["coverage_amount"],
                auto_renew=True,
                status="active",
            )
        )

    if not existing_trigger:
        db.add(
            Trigger(
                user_id=user.id,
                trigger_type="Rainfall Risk Watch",
                trigger_value=float((premium_data["risk_score"] + 1) * 10),
                zone=user.zone,
                status="monitoring",
            )
        )

    if not existing_notification:
        db.add(
            Notification(
                user_id=user.id,
                title="Starter policy activated",
                message=(
                    f"Your first policy has been created for {user.city}. "
                    "A live risk watch is also active so your claims page shows current monitoring."
                ),
                notification_type="policy",
                is_read=False,
            )
        )

    db.commit()


def build_token_response(user: User) -> TokenResponse:
    access_token = create_access_token(
        data={"sub": user.id},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse(
            id=user.id,
            email=user.email,
            name=user.name,
            phone=user.phone,
            city=user.city,
            zone=user.zone,
            platform=user.platform,
            partner_id=user.partner_id,
            weekly_income=user.weekly_income,
            payout_method=user.payout_method,
            role=user.role,
            aadhaar_number=user.aadhaar_number,
            pan_number=user.pan_number,
            verification_status=user.verification_status,
            created_at=user.created_at
        )
    )


def generate_admin_identity(name: str) -> tuple[str, str]:
    slug = re.sub(r"[^a-z0-9]+", "-", name.strip().lower()).strip("-") or "admin"
    suffix = uuid.uuid4().hex[:8]
    return (
        f"{slug}-{suffix}@livpay.admin",
        f"admin-{suffix}",
    )


@router.post("/register", response_model=TokenResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.phone == user.phone).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Phone number already registered")
    
    if user.email:
        existing_email = db.query(User).filter(User.email == user.email).first()
        if existing_email:
            raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = get_password_hash(user.password)
    
    new_user = User(
        email=user.email,
        password_hash=hashed_password,
        name=user.name,
        phone=user.phone,
        city=user.city,
        zone=user.zone,
        platform=user.platform,
        partner_id=user.partner_id,
        weekly_income=user.weekly_income,
        payout_method=user.payout_method,
        aadhaar_number=user.aadhaar_number,
        pan_number=user.pan_number,
        role=UserRole.worker
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    seed_worker_starter_data(new_user, db)
    return build_token_response(new_user)


@router.post("/admin/register", response_model=TokenResponse)
def register_admin(admin: AdminCreate, db: Session = Depends(get_db)):
    if admin.admin_pin != admin.confirm_admin_pin:
        raise HTTPException(status_code=400, detail="Admin PIN confirmation does not match")

    existing_phone = db.query(User).filter(User.phone == admin.phone).first()
    if existing_phone:
        raise HTTPException(status_code=400, detail="Phone number already registered")

    existing_email = db.query(User).filter(User.email == admin.email).first()
    if existing_email:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_admin = User(
        email=admin.email,
        password_hash=get_password_hash(admin.admin_pin),
        name=admin.name,
        phone=admin.phone,
        city="Admin",
        zone="HQ",
        platform="LivPay AI",
        partner_id=None,
        weekly_income=0,
        payout_method="Bank Transfer",
        aadhaar_number=None,
        pan_number=None,
        role=UserRole.admin
    )

    db.add(new_admin)
    db.commit()
    db.refresh(new_admin)
    return build_token_response(new_admin)


@router.post("/admin/access", response_model=TokenResponse)
def admin_access(request: AdminAccessRequest, db: Session = Depends(get_db)):
    admin = db.query(User).filter(
        User.role == UserRole.admin,
        User.name.ilike(request.name.strip())
    ).first()

    if admin:
        if not verify_password(request.admin_pin, admin.password_hash):
            raise HTTPException(status_code=401, detail="Invalid admin name or PIN")
        return build_token_response(admin)

    admin_count = db.query(User).filter(User.role == UserRole.admin).count()
    if admin_count > 0:
        raise HTTPException(status_code=404, detail="Admin not found. Enter the saved admin name.")

    email, phone = generate_admin_identity(request.name)
    new_admin = User(
        email=email,
        password_hash=get_password_hash(request.admin_pin),
        name=request.name.strip(),
        phone=phone,
        city="Admin",
        zone="HQ",
        platform="LivPay AI",
        partner_id=None,
        weekly_income=0,
        payout_method="Bank Transfer",
        aadhaar_number=None,
        pan_number=None,
        role=UserRole.admin
    )
    db.add(new_admin)
    db.commit()
    db.refresh(new_admin)
    return build_token_response(new_admin)


@router.post("/login", response_model=TokenResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.phone == request.phone).first()
    
    if not user or not verify_password(request.password, user.password_hash):
        raise HTTPException(
            status_code=401,
            detail="Invalid phone number or password"
        )

    return build_token_response(user)


@router.post("/admin/login", response_model=TokenResponse)
def admin_login(request: AdminLoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.phone == request.phone).first()
    
    if not user or not verify_password(request.admin_pin, user.password_hash):
        raise HTTPException(
            status_code=401,
            detail="Invalid phone number or admin PIN"
        )

    if user.role != UserRole.admin:
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )

    return build_token_response(user)


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        name=current_user.name,
        phone=current_user.phone,
        city=current_user.city,
        zone=current_user.zone,
        platform=current_user.platform,
        partner_id=current_user.partner_id,
        weekly_income=current_user.weekly_income,
        payout_method=current_user.payout_method,
        role=current_user.role,
        aadhaar_number=current_user.aadhaar_number,
        pan_number=current_user.pan_number,
        verification_status=current_user.verification_status,
        created_at=current_user.created_at
    )
