import os
import random
from typing import Optional
import joblib
import numpy as np
import pandas as pd

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(SCRIPT_DIR, "..", "..", ".."))
MODEL_PATH = os.path.join(PROJECT_ROOT, "ml", "models", "income_loss_model.pkl")

FEATURES = [
    "city_risk",
    "zone_risk",
    "weekly_income",
    "rainfall_mm",
    "aqi",
    "temperature_c",
    "working_hours",
    "orders_per_day",
    "traffic_index",
    "platform_demand_index",
]

HIGH_RISK_CITIES = {"hyderabad", "mumbai", "chennai", "delhi", "kolkata"}
HIGH_RISK_ZONES = {
    "ameerpet", "madhapur", "kukatpally", "t nagar", "andheri",
    "koramangala", "indiranagar", "whitefield", "sector 18",
}

_model = None


def get_model():
    global _model
    if _model is None:
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(
                f"Model file not found at {MODEL_PATH}. "
                "Run ml/scripts/train_model.py first."
            )
        _model = joblib.load(MODEL_PATH)
    return _model


def _city_risk_value(city: str) -> int:
    return 2 if city.lower().strip() in HIGH_RISK_CITIES else 1


def _zone_risk_value(zone: str) -> int:
    return 2 if zone.lower().strip() in HIGH_RISK_ZONES else 1


def _fetch_weather(city: str) -> dict:
    weather_profiles = {
        "hyderabad": {"rainfall_mm": round(random.uniform(10, 60), 1), "temperature_c": round(random.uniform(30, 42), 1)},
        "mumbai": {"rainfall_mm": round(random.uniform(20, 90), 1), "temperature_c": round(random.uniform(28, 38), 1)},
        "chennai": {"rainfall_mm": round(random.uniform(5, 50), 1), "temperature_c": round(random.uniform(32, 45), 1)},
        "delhi": {"rainfall_mm": round(random.uniform(0, 30), 1), "temperature_c": round(random.uniform(25, 46), 1)},
        "kolkata": {"rainfall_mm": round(random.uniform(15, 70), 1), "temperature_c": round(random.uniform(28, 40), 1)},
    }
    city_key = city.lower().strip()
    if city_key in weather_profiles:
        return weather_profiles[city_key]
    return {"rainfall_mm": round(random.uniform(0, 25), 1), "temperature_c": round(random.uniform(22, 38), 1)}


def _estimate_aqi(city: str) -> int:
    aqi_profiles = {
        "delhi": random.randint(200, 350),
        "mumbai": random.randint(120, 250),
        "kolkata": random.randint(150, 280),
        "hyderabad": random.randint(80, 200),
        "chennai": random.randint(60, 160),
    }
    return aqi_profiles.get(city.lower().strip(), random.randint(50, 180))


def _estimate_traffic(city: str) -> int:
    traffic_profiles = {
        "mumbai": random.randint(7, 10),
        "delhi": random.randint(7, 10),
        "bangalore": random.randint(6, 10),
        "hyderabad": random.randint(5, 9),
        "chennai": random.randint(4, 8),
        "kolkata": random.randint(5, 9),
    }
    return traffic_profiles.get(city.lower().strip(), random.randint(3, 7))


def _estimate_platform_demand() -> int:
    return random.randint(2, 9)


def _estimate_working_hours() -> float:
    return round(random.uniform(5, 12), 1)


def _estimate_orders_per_day() -> int:
    return random.randint(10, 50)


def classify_risk(score: float) -> str:
    if score >= 70:
        return "High"
    elif score >= 40:
        return "Medium"
    return "Low"


def get_reason(score: float, weather: dict, aqi: int, traffic: int) -> str:
    reasons = []
    if weather["rainfall_mm"] > 30:
        reasons.append("Heavy rainfall expected")
    if aqi > 150:
        reasons.append("Poor air quality")
    if weather["temperature_c"] > 40:
        reasons.append("Extreme heat conditions")
    if traffic > 7:
        reasons.append("High traffic congestion")
    if not reasons:
        reasons.append("Normal operating conditions")
    return " | ".join(reasons)


def get_suggested_action(risk_level: str) -> str:
    actions = {
        "High": "Activate income protection immediately. Avoid peak disruption hours and high-risk zones.",
        "Medium": "Keep protection active. Monitor weather and traffic updates throughout the day.",
        "Low": "Risk is manageable. Standard protection coverage is sufficient today.",
    }
    return actions.get(risk_level, "Monitor conditions.")


def get_alert_message(risk_level: str, score: float) -> str:
    messages = {
        "High": f"HIGH RISK ALERT: Income loss risk score is {score:.0f}/100. Immediate action recommended.",
        "Medium": f"MODERATE RISK: Income loss risk score is {score:.0f}/100. Stay vigilant.",
        "Low": f"LOW RISK: Income loss risk score is {score:.0f}/100. Conditions are favorable.",
    }
    return messages.get(risk_level, "Risk assessment unavailable.")


def predict_income_loss(
    city: str,
    zone: str,
    weekly_income: float,
    rainfall_mm: Optional[float] = None,
    aqi: Optional[int] = None,
    temperature_c: Optional[float] = None,
    working_hours: Optional[float] = None,
    orders_per_day: Optional[int] = None,
    traffic_index: Optional[int] = None,
    platform_demand_index: Optional[int] = None,
) -> dict:
    model = get_model()

    weather = _fetch_weather(city)
    if rainfall_mm is None:
        rainfall_mm = weather["rainfall_mm"]
    if temperature_c is None:
        temperature_c = weather["temperature_c"]
    if aqi is None:
        aqi = _estimate_aqi(city)
    if traffic_index is None:
        traffic_index = _estimate_traffic(city)
    if platform_demand_index is None:
        platform_demand_index = _estimate_platform_demand()
    if working_hours is None:
        working_hours = _estimate_working_hours()
    if orders_per_day is None:
        orders_per_day = _estimate_orders_per_day()

    city_risk_val = _city_risk_value(city)
    zone_risk_val = _zone_risk_value(zone)

    input_data = pd.DataFrame([{
        "city_risk": city_risk_val,
        "zone_risk": zone_risk_val,
        "weekly_income": weekly_income,
        "rainfall_mm": rainfall_mm,
        "aqi": aqi,
        "temperature_c": temperature_c,
        "working_hours": working_hours,
        "orders_per_day": orders_per_day,
        "traffic_index": traffic_index,
        "platform_demand_index": platform_demand_index,
    }])[FEATURES]

    risk_score = float(model.predict(input_data)[0])
    risk_score = round(np.clip(risk_score, 0, 100), 1)

    risk_level = classify_risk(risk_score)

    return {
        "income_loss_risk_score": risk_score,
        "risk_level": risk_level,
        "reason": get_reason(risk_score, weather, aqi, traffic_index),
        "suggested_action": get_suggested_action(risk_level),
        "alert_message": get_alert_message(risk_level, risk_score),
        "weather_data": {
            "rainfall_mm": rainfall_mm,
            "temperature_c": temperature_c,
        },
        "traffic_data": {
            "traffic_index": traffic_index,
        },
        "platform_demand_data": {
            "platform_demand_index": platform_demand_index,
        },
    }


def predict_income_loss_from_features(
    city_risk: int,
    zone_risk: int,
    weekly_income: float,
    rainfall_mm: float,
    aqi: int,
    temperature_c: float,
    working_hours: float,
    orders_per_day: int,
    traffic_index: int,
    platform_demand_index: int,
) -> dict:
    model = get_model()

    input_data = pd.DataFrame([{
        "city_risk": city_risk,
        "zone_risk": zone_risk,
        "weekly_income": weekly_income,
        "rainfall_mm": rainfall_mm,
        "aqi": aqi,
        "temperature_c": temperature_c,
        "working_hours": working_hours,
        "orders_per_day": orders_per_day,
        "traffic_index": traffic_index,
        "platform_demand_index": platform_demand_index,
    }])[FEATURES]

    risk_score = float(model.predict(input_data)[0])
    risk_score = round(np.clip(risk_score, 0, 100), 1)

    risk_level = classify_risk(risk_score)
    weather = {"rainfall_mm": rainfall_mm, "temperature_c": temperature_c}

    return {
        "income_loss_risk_score": risk_score,
        "risk_level": risk_level,
        "reason": get_reason(risk_score, weather, aqi, traffic_index),
        "suggested_action": get_suggested_action(risk_level),
        "alert_message": get_alert_message(risk_level, risk_score),
        "weather_data": {
            "rainfall_mm": rainfall_mm,
            "temperature_c": temperature_c,
        },
        "traffic_data": {
            "traffic_index": traffic_index,
        },
        "platform_demand_data": {
            "platform_demand_index": platform_demand_index,
        },
    }
