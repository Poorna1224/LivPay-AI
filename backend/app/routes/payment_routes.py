from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timedelta, timezone
import uuid
from app.database import get_db
from app.models.payment import Payment, PaymentStatus, PaymentType
from app.models.user import User
from app.models.policy import Policy
from app.schemas.payment import PaymentResponse, PaymentCreate
from app.services.premium_service import calculate_premium

router = APIRouter(prefix="/payments", tags=["Payments"])


@router.get("/{user_id}", response_model=List[PaymentResponse])
def get_payments_by_user(user_id: int, db: Session = Depends(get_db)):
    payments = db.query(Payment).filter(Payment.user_id == user_id).all()
    if not payments:
        payments = []
    return payments


@router.get("/summary/{user_id}")
def get_payment_summary(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    premium_data = calculate_premium(
        city=user.city,
        zone=user.zone,
        weekly_income=user.weekly_income,
    )

    latest_payment = (
        db.query(Payment)
        .filter(
            Payment.user_id == user_id,
            Payment.type == PaymentType.premium,
            Payment.status == PaymentStatus.completed,
        )
        .order_by(Payment.date.desc())
        .first()
    )

    active_policy = (
        db.query(Policy)
        .filter(Policy.user_id == user_id, Policy.status == "active")
        .order_by(Policy.created_at.desc())
        .first()
    )

    now = datetime.now(timezone.utc)
    if latest_payment:
        due_base = latest_payment.date
    elif active_policy and active_policy.created_at:
        due_base = active_policy.created_at
    else:
        due_base = now

    next_due_date = due_base + timedelta(days=7)
    last_payment_date = latest_payment.date if latest_payment else None

    return {
        "user_id": user.id,
        "name": user.name,
        "weekly_income": user.weekly_income,
        "risk_level": premium_data["risk_level"],
        "weekly_premium": premium_data["weekly_premium"],
        "coverage_amount": premium_data["coverage_amount"],
        "coverage_label": premium_data["coverage_label"],
        "payment_frequency": premium_data["payment_frequency"],
        "payment_method": user.payout_method,
        "last_payment_date": last_payment_date,
        "next_due_date": next_due_date,
        "amount_due_now": premium_data["weekly_premium"],
        "is_due": next_due_date <= now or latest_payment is None,
    }


@router.post("/", response_model=PaymentResponse)
def create_payment(payment: PaymentCreate, db: Session = Depends(get_db)):
    db_payment = Payment(
        user_id=payment.user_id,
        amount=payment.amount,
        type=payment.type,
        status="pending"
    )
    db.add(db_payment)
    db.commit()
    db.refresh(db_payment)
    return db_payment


@router.post("/premium/{user_id}/pay", response_model=PaymentResponse)
def pay_weekly_premium(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    premium_data = calculate_premium(
        city=user.city,
        zone=user.zone,
        weekly_income=user.weekly_income,
    )

    transaction_id = f"LIVPAY-{uuid.uuid4().hex[:10].upper()}"
    db_payment = Payment(
        user_id=user_id,
        amount=premium_data["weekly_premium"],
        type=PaymentType.premium,
        status=PaymentStatus.completed,
        transaction_id=transaction_id,
    )
    db.add(db_payment)
    db.commit()
    db.refresh(db_payment)
    return db_payment


@router.get("/status/{payment_id}", response_model=PaymentResponse)
def get_payment_status(payment_id: int, db: Session = Depends(get_db)):
    payment = db.query(Payment).filter(Payment.id == payment_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    return payment


@router.put("/{payment_id}/complete", response_model=PaymentResponse)
def complete_payment(payment_id: int, db: Session = Depends(get_db)):
    payment = db.query(Payment).filter(Payment.id == payment_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    payment.status = "completed"
    db.commit()
    db.refresh(payment)
    return payment
