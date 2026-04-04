from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.policy import Policy
from app.models.user import User
from app.schemas.policy import PolicyCreate, PolicyResponse

router = APIRouter(prefix="/policies", tags=["Policies"])


@router.post("/", response_model=PolicyResponse)
def create_policy(policy: PolicyCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == policy.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    new_policy = Policy(
        user_id=policy.user_id,
        weekly_premium=policy.weekly_premium,
        coverage_amount=policy.coverage_amount,
        auto_renew=policy.auto_renew,
        status="active"
    )

    db.add(new_policy)
    db.commit()
    db.refresh(new_policy)
    return new_policy


@router.get("/user/{user_id}", response_model=list[PolicyResponse])
def get_policies_by_user(user_id: int, db: Session = Depends(get_db)):
    return db.query(Policy).filter(Policy.user_id == user_id).all()