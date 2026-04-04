from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from app.database import get_db
from app.models.user import User
from app.services.ai_predictor_service import predict_income_loss, predict_income_loss_from_features

router = APIRouter(prefix="/ai", tags=["AI Predictor"])


class PredictionRequest(BaseModel):
    city_risk: int
    zone_risk: int
    weekly_income: float
    rainfall_mm: float
    aqi: int
    temperature_c: float
    working_hours: float
    orders_per_day: int
    traffic_index: int
    platform_demand_index: int


@router.get("/income-loss/{user_id}")
def get_income_loss_prediction(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    prediction = predict_income_loss(
        city=str(user.city),
        zone=str(user.zone),
        weekly_income=float(user.weekly_income),
    )

    return {
        "user_id": user.id,
        "name": user.name,
        "city": user.city,
        "zone": user.zone,
        "weekly_income": user.weekly_income,
        **prediction,
    }


@router.post("/income-loss/predict")
def predict_income_loss_manual(request: PredictionRequest):
    prediction = predict_income_loss_from_features(
        city_risk=request.city_risk,
        zone_risk=request.zone_risk,
        weekly_income=request.weekly_income,
        rainfall_mm=request.rainfall_mm,
        aqi=request.aqi,
        temperature_c=request.temperature_c,
        working_hours=request.working_hours,
        orders_per_day=request.orders_per_day,
        traffic_index=request.traffic_index,
        platform_demand_index=request.platform_demand_index,
    )

    return prediction
