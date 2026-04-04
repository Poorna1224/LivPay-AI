from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User, VerificationStatus, UserRole
from app.schemas.user import UserCreate, UserResponse, KYCUpdate, LoginRequest, AdminLoginRequest, TokenResponse
from app.auth import get_current_user, get_current_admin, get_password_hash, verify_password, create_access_token
import os
from datetime import datetime, timedelta

router = APIRouter(prefix="/api", tags=["Auth"])

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/register/worker", response_model=UserResponse)
def register_worker(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.phone == user.phone).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Phone number already registered. Please login instead.")

    new_user = User(
        email=user.email,
        password_hash=get_password_hash(user.password),
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
    return new_user


@router.post("/login/worker", response_model=TokenResponse)
def login_worker(login_data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.phone == login_data.phone, User.role == UserRole.worker).first()
    if not user or not verify_password(login_data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid phone or password")
    
    access_token = create_access_token(
        data={"sub": str(user.id), "role": user.role},
        expires_delta=timedelta(minutes=1440)
    )
    return {"access_token": access_token, "token_type": "bearer", "user": user}


@router.post("/login/admin", response_model=TokenResponse)
def login_admin(login_data: AdminLoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.phone == login_data.phone, User.role == UserRole.admin).first()
    if not user or not verify_password(login_data.admin_pin, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid admin credentials")
    
    access_token = create_access_token(
        data={"sub": str(user.id), "role": user.role},
        expires_delta=timedelta(minutes=1440)
    )
    return {"access_token": access_token, "token_type": "bearer", "user": user}


@router.get("/", response_model=list[UserResponse])
def get_users(db: Session = Depends(get_db)):
    return db.query(User).all()


@router.post("/workers/kyc", response_model=UserResponse)
def update_kyc(kyc: KYCUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == current_user.id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if kyc.aadhaar_number:
        user.aadhaar_number = kyc.aadhaar_number
    if kyc.pan_number:
        user.pan_number = kyc.pan_number
    if kyc.platform_proof_url:
        user.platform_proof_url = kyc.platform_proof_url
    if kyc.earnings_proof_url:
        user.earnings_proof_url = kyc.earnings_proof_url
    
    user.verification_status = VerificationStatus.pending
    
    db.commit()
    db.refresh(user)
    return user


@router.get("/admin/workers/pending", response_model=list[UserResponse])
def get_pending_workers(current_user: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    return db.query(User).filter(User.verification_status == VerificationStatus.pending, User.role == UserRole.worker).all()


@router.put("/admin/workers/{worker_id}/approve", response_model=UserResponse)
def approve_worker(worker_id: int, current_user: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    worker = db.query(User).filter(User.id == worker_id, User.role == UserRole.worker).first()
    if not worker:
        raise HTTPException(status_code=404, detail="Worker not found")
    
    worker.verification_status = VerificationStatus.verified
    worker.verified_by = current_user.id
    worker.verified_at = datetime.utcnow()
    
    db.commit()
    db.refresh(worker)
    return worker


@router.put("/admin/workers/{worker_id}/reject", response_model=UserResponse)
def reject_worker(worker_id: int, current_user: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    worker = db.query(User).filter(User.id == worker_id, User.role == UserRole.worker).first()
    if not worker:
        raise HTTPException(status_code=404, detail="Worker not found")
    
    worker.verification_status = VerificationStatus.rejected
    worker.verified_by = current_user.id
    worker.verified_at = datetime.utcnow()
    
    db.commit()
    db.refresh(worker)
    return worker


@router.get("/admin/workers/all", response_model=list[UserResponse])
def get_all_workers(current_user: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    return db.query(User).filter(User.role == UserRole.worker).all()


@router.get("/workers/me", response_model=UserResponse)
def get_current_worker_profile(current_user: User = Depends(get_current_user)):
    return current_user