from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.claim import Claim
from app.models.payout import Payout
from app.schemas.payout import PayoutResponse

router = APIRouter(prefix="/payouts", tags=["Payouts"])


@router.post("/process/{claim_id}", response_model=PayoutResponse)
def process_payout(claim_id: int, db: Session = Depends(get_db)):
    claim = db.query(Claim).filter(Claim.id == claim_id).first()

    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")

    if claim.status == "paid":
        raise HTTPException(status_code=400, detail="Payout already processed")

    payout = Payout(
        claim_id=claim.id,
        amount=claim.claim_amount,
        payout_method="UPI",
        status="processed"
    )

    claim.status = "paid"

    db.add(payout)
    db.commit()
    db.refresh(payout)

    return payout


@router.get("/claim/{claim_id}", response_model=list[PayoutResponse])
def get_payouts_by_claim(claim_id: int, db: Session = Depends(get_db)):
    return db.query(Payout).filter(Payout.claim_id == claim_id).all()


@router.get("/user/{user_id}", response_model=list[PayoutResponse])
def get_payouts_by_user(user_id: int, db: Session = Depends(get_db)):
    claims = db.query(Claim).filter(Claim.user_id == user_id).all()
    claim_ids = [c.id for c in claims]
    if not claim_ids:
        return []
    return db.query(Payout).filter(Payout.claim_id.in_(claim_ids)).all()


@router.get("/{payout_id}", response_model=PayoutResponse)
def get_payout(payout_id: int, db: Session = Depends(get_db)):
    payout = db.query(Payout).filter(Payout.id == payout_id).first()
    if not payout:
        raise HTTPException(status_code=404, detail="Payout not found")
    return payout
