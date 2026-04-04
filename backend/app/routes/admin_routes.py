from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.database import get_db
from app.models.user import User, VerificationStatus, UserRole
from app.models.policy import Policy
from app.models.trigger import Trigger
from app.models.claim import Claim
from app.models.payout import Payout
from app.models.payment import Payment
from app.models.notification import Notification
from app.models.fraud_log import FraudLog
from app.schemas.user import UserResponse
from app.auth import get_current_admin

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/workers/pending", response_model=List[UserResponse])
def get_pending_workers(db: Session = Depends(get_db), current_user: User = Depends(get_current_admin)):
    workers = db.query(User).filter(
        User.role == UserRole.worker,
        User.verification_status == VerificationStatus.pending
    ).all()
    return workers


@router.get("/workers/verified", response_model=List[UserResponse])
def get_verified_workers(db: Session = Depends(get_db), current_user: User = Depends(get_current_admin)):
    workers = db.query(User).filter(
        User.role == UserRole.worker,
        User.verification_status == VerificationStatus.verified
    ).all()
    return workers


@router.get("/workers/rejected", response_model=List[UserResponse])
def get_rejected_workers(db: Session = Depends(get_db), current_user: User = Depends(get_current_admin)):
    workers = db.query(User).filter(
        User.role == UserRole.worker,
        User.verification_status == VerificationStatus.rejected
    ).all()
    return workers


@router.get("/workers/all", response_model=List[UserResponse])
def get_all_workers(db: Session = Depends(get_db), current_user: User = Depends(get_current_admin)):
    workers = db.query(User).filter(User.role == UserRole.worker).all()
    return workers


@router.post("/workers/{worker_id}/verify")
def verify_worker(worker_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_admin)):
    worker = db.query(User).filter(User.id == worker_id).first()
    if not worker:
        raise HTTPException(status_code=404, detail="Worker not found")
    
    worker.verification_status = VerificationStatus.verified
    worker.verified_at = datetime.utcnow()
    worker.verified_by = current_user.id
    
    db.commit()
    return {"message": "Worker verified successfully", "worker_id": worker_id}


@router.post("/workers/{worker_id}/reject")
def reject_worker(worker_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_admin)):
    worker = db.query(User).filter(User.id == worker_id).first()
    if not worker:
        raise HTTPException(status_code=404, detail="Worker not found")
    
    worker.verification_status = VerificationStatus.rejected
    worker.verified_at = datetime.utcnow()
    worker.verified_by = current_user.id
    
    db.commit()
    return {"message": "Worker rejected", "worker_id": worker_id}


@router.delete("/workers/{worker_id}")
def delete_worker(worker_id: int, db: Session = Depends(get_db)):
    worker = db.query(User).filter(
        User.id == worker_id,
        User.role == UserRole.worker
    ).first()
    if not worker:
        raise HTTPException(status_code=404, detail="Worker not found")

    claim_ids = [claim_id for (claim_id,) in db.query(Claim.id).filter(Claim.user_id == worker_id).all()]

    fraud_deleted = 0
    payout_deleted = 0

    if claim_ids:
        fraud_deleted = db.query(FraudLog).filter(FraudLog.claim_id.in_(claim_ids)).delete(synchronize_session=False)
        payout_deleted = db.query(Payout).filter(Payout.claim_id.in_(claim_ids)).delete(synchronize_session=False)

    fraud_deleted += db.query(FraudLog).filter(FraudLog.user_id == worker_id).delete(synchronize_session=False)
    payments_deleted = db.query(Payment).filter(Payment.user_id == worker_id).delete(synchronize_session=False)
    notifications_deleted = db.query(Notification).filter(Notification.user_id == worker_id).delete(synchronize_session=False)
    claims_deleted = db.query(Claim).filter(Claim.user_id == worker_id).delete(synchronize_session=False)
    triggers_deleted = db.query(Trigger).filter(Trigger.user_id == worker_id).delete(synchronize_session=False)
    policies_deleted = db.query(Policy).filter(Policy.user_id == worker_id).delete(synchronize_session=False)
    db.delete(worker)
    db.commit()

    return {
        "message": "Worker deleted successfully",
        "worker_id": worker_id,
        "deleted": {
            "policies": policies_deleted,
            "triggers": triggers_deleted,
            "claims": claims_deleted,
            "payouts": payout_deleted,
            "payments": payments_deleted,
            "notifications": notifications_deleted,
            "fraud_logs": fraud_deleted,
        },
    }


@router.get("/stats")
def get_admin_stats(db: Session = Depends(get_db), current_user: User = Depends(get_current_admin)):
    total_workers = db.query(User).filter(User.role == UserRole.worker).count()
    pending_verification = db.query(User).filter(
        User.role == UserRole.worker,
        User.verification_status == VerificationStatus.pending
    ).count()
    verified = db.query(User).filter(
        User.role == UserRole.worker,
        User.verification_status == VerificationStatus.verified
    ).count()
    rejected = db.query(User).filter(
        User.role == UserRole.worker,
        User.verification_status == VerificationStatus.rejected
    ).count()
    
    return {
        "total_workers": total_workers,
        "pending_verification": pending_verification,
        "verified": verified,
        "rejected": rejected
    }
