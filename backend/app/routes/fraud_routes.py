from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.claim import Claim
from app.models.fraud_log import FraudLog
from app.schemas.fraud_log import FraudLogResponse
from app.services.fraud_service import evaluate_claim_fraud

router = APIRouter(prefix="/fraud", tags=["Fraud Detection"])


@router.post("/check/{claim_id}", response_model=FraudLogResponse)
def check_claim_fraud(claim_id: int, db: Session = Depends(get_db)):
    claim = db.query(Claim).filter(Claim.id == claim_id).first()

    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")

    result = evaluate_claim_fraud(claim.user_id, claim.id, db)

    fraud_log = FraudLog(
        user_id=claim.user_id,
        claim_id=claim.id,
        fraud_score=result["fraud_score"],
        fraud_status=result["fraud_status"],
        reason=result["reason"]
    )

    db.add(fraud_log)
    db.commit()
    db.refresh(fraud_log)

    return fraud_log


@router.get("/user/{user_id}", response_model=list[FraudLogResponse])
def get_fraud_logs_by_user(user_id: int, db: Session = Depends(get_db)):
    return db.query(FraudLog).filter(FraudLog.user_id == user_id).all()
