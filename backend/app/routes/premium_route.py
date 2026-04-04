from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.services.premium_service import calculate_premium

router = APIRouter(prefix="/premium", tags=["Premium"])


@router.get("/user/{user_id}")
def get_premium_for_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    premium_data = calculate_premium(
        city=user.city,
        zone=user.zone,
        weekly_income=user.weekly_income
    )

    return {
        "user_id": user.id,
        "name": user.name,
        "city": user.city,
        "zone": user.zone,
        "weekly_income": user.weekly_income,
        **premium_data
    }