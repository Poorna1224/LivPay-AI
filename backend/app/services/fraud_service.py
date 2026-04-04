from sqlalchemy.orm import Session
from app.models.claim import Claim


def evaluate_claim_fraud(user_id: int, claim_id: int, db: Session):
    user_claims = db.query(Claim).filter(Claim.user_id == user_id).all()
    total_claims = len(user_claims)

    current_claim = db.query(Claim).filter(Claim.id == claim_id).first()

    fraud_score = 0.0
    reasons = []

    if total_claims > 3:
        fraud_score += 50
        reasons.append("Too many claims by user")

    if current_claim and current_claim.claim_amount > 220:
        fraud_score += 30
        reasons.append("High claim amount")

    if total_claims == 1:
        fraud_score += 5
        reasons.append("First claim - low risk baseline")

    if fraud_score >= 50:
        fraud_status = "suspicious"
    else:
        fraud_status = "normal"

    return {
        "fraud_score": fraud_score,
        "fraud_status": fraud_status,
        "reason": ", ".join(reasons)
    }
