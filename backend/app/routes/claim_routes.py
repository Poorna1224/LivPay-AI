from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.trigger import Trigger
from app.models.claim import Claim
from app.schemas.claim import ClaimResponse
from app.services.claim_service import calculate_claim_amount

router = APIRouter(prefix="/claims", tags=["Claims"])


@router.post("/create-from-trigger/{trigger_id}", response_model=ClaimResponse)
def create_claim_from_trigger(trigger_id: int, db: Session = Depends(get_db)):
    trigger = db.query(Trigger).filter(Trigger.id == trigger_id).first()

    if not trigger:
        raise HTTPException(status_code=404, detail="Trigger not found")

    existing_claim = db.query(Claim).filter(Claim.trigger_id == trigger_id).first()
    if existing_claim:
        raise HTTPException(status_code=400, detail="Claim already exists for this trigger")

    claim_amount = calculate_claim_amount(trigger.trigger_type)

    new_claim = Claim(
        user_id=trigger.user_id,
        trigger_id=trigger.id,
        claim_amount=claim_amount,
        status="initiated"
    )

    db.add(new_claim)
    db.commit()
    db.refresh(new_claim)

    return new_claim


@router.get("/user/{user_id}", response_model=list[ClaimResponse])
def get_claims_by_user(user_id: int, db: Session = Depends(get_db)):
    return db.query(Claim).filter(Claim.user_id == user_id).all()
