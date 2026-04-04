from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models.user import User
from app.models.policy import Policy
from app.models.trigger import Trigger
from app.models.claim import Claim
from app.models.payout import Payout
from app.models.fraud_log import FraudLog

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/summary")
def get_dashboard_summary(db: Session = Depends(get_db)):
    total_users = db.query(func.count(User.id)).scalar()
    total_policies = db.query(func.count(Policy.id)).scalar()
    total_triggers = db.query(func.count(Trigger.id)).scalar()
    total_claims = db.query(func.count(Claim.id)).scalar()
    total_payouts = db.query(func.count(Payout.id)).scalar()
    total_fraud_checks = db.query(func.count(FraudLog.id)).scalar()
    suspicious_fraud_cases = db.query(func.count(FraudLog.id)).filter(FraudLog.fraud_status == "suspicious").scalar()

    return {
        "total_users": total_users,
        "total_policies": total_policies,
        "total_triggers": total_triggers,
        "total_claims": total_claims,
        "total_payouts": total_payouts,
        "total_fraud_checks": total_fraud_checks,
        "suspicious_fraud_cases": suspicious_fraud_cases
    }


@router.get("/user/{user_id}")
def get_user_dashboard(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    policy_count = db.query(func.count(Policy.id)).filter(Policy.user_id == user_id).scalar()
    trigger_count = db.query(func.count(Trigger.id)).filter(Trigger.user_id == user_id).scalar()
    claim_count = db.query(func.count(Claim.id)).filter(Claim.user_id == user_id).scalar()

    total_claim_amount = db.query(func.coalesce(func.sum(Claim.claim_amount), 0)).filter(Claim.user_id == user_id).scalar()

    fraud_checks = db.query(func.count(FraudLog.id)).filter(FraudLog.user_id == user_id).scalar()

    return {
        "user_id": user.id,
        "name": user.name,
        "city": user.city,
        "zone": user.zone,
        "platform": user.platform,
        "weekly_income": user.weekly_income,
        "policy_count": policy_count,
        "trigger_count": trigger_count,
        "claim_count": claim_count,
        "total_claim_amount": float(total_claim_amount),
        "fraud_checks": fraud_checks
    }
