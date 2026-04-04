from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.trigger import Trigger
from app.schemas.trigger import TriggerResponse
from app.services.trigger_service import evaluate_triggers

router = APIRouter(prefix="/triggers", tags=["Triggers"])


@router.post("/check/{user_id}", response_model=list[TriggerResponse])
def check_triggers_for_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    trigger_results = evaluate_triggers(user.city, user.zone)

    created_triggers = []

    for item in trigger_results:
        new_trigger = Trigger(
            user_id=user.id,
            trigger_type=item["trigger_type"],
            trigger_value=item["trigger_value"],
            zone=item["zone"],
            status="detected"
        )
        db.add(new_trigger)
        db.commit()
        db.refresh(new_trigger)
        created_triggers.append(new_trigger)

    return created_triggers


@router.get("/user/{user_id}", response_model=list[TriggerResponse])
def get_triggers_by_user(user_id: int, db: Session = Depends(get_db)):
    return db.query(Trigger).filter(Trigger.user_id == user_id).all()