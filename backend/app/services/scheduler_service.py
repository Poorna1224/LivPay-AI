import logging
import os
import requests
from datetime import datetime, timedelta
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from apscheduler.schedulers.background import BackgroundScheduler
from app.database import SessionLocal, Base, engine
from app.models.trigger import Trigger
from app.models.claim import Claim
from app.models.policy import Policy
from app.models.payout import Payout
from app.models.fraud_log import FraudLog
from app.models.notification import Notification
from app.models.user import User
from app.services.mock_data_service import get_weather_data, get_aqi_data, get_traffic_data, detect_triggers
from app.services.fraud_service import evaluate_claim_fraud

Base.metadata.create_all(bind=engine)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

API_KEY = os.getenv("WEATHER_API_KEY")
WEATHER_API_BASE_URL = os.getenv("WEATHER_API_BASE_URL", "https://api.weatherapi.com/v1/current.json")

scheduler = BackgroundScheduler()


def get_weather(city: str):
    try:
        if not API_KEY:
            logger.warning("WEATHER_API_KEY is not configured")
            return None

        response = requests.get(
            WEATHER_API_BASE_URL,
            params={"key": API_KEY, "q": city, "aqi": "no"},
            timeout=10,
        )
        response.raise_for_status()
        payload = response.json()
        weather = payload.get("current", {}).get("condition", {}).get("text")

        if not weather:
            logger.warning(f"No weather condition returned for city: {city}")
            return None

        return weather.lower()
    except Exception as exc:
        logger.error(f"Real weather API failed for city {city}: {exc}")
        return None


def is_recent_trigger(db, user_id, trigger_type, zone):
    one_hour_ago = datetime.utcnow() - timedelta(hours=1)
    existing = db.query(Trigger).filter(
        Trigger.user_id == user_id,
        Trigger.trigger_type == trigger_type,
        Trigger.zone == zone,
        Trigger.created_at >= one_hour_ago
    ).first()
    return existing is not None


def can_send_notification(db, user_id):
    last = db.query(Notification).filter(
        Notification.user_id == user_id
    ).order_by(Notification.created_at.desc()).first()

    if last:
        diff = datetime.utcnow() - last.created_at
        if diff.seconds < 1800:
            return False
    return True


def create_notification(db: Session, user_id: int, title: str, message: str, notification_type: str):
    notification = Notification(
        user_id=user_id,
        title=title,
        message=message,
        notification_type=notification_type
    )
    db.add(notification)
    return notification


def get_active_policies(db: Session) -> List[Policy]:
    return db.query(Policy).filter(Policy.status == "active").all()


def process_trigger_for_policy(db: Session, policy: Policy, trigger: Dict[str, Any]):
    existing_trigger = db.query(Trigger).filter(
        Trigger.user_id == policy.user_id,
        Trigger.trigger_type == trigger["trigger_type"],
        Trigger.zone == trigger["zone"]
    ).first()
    
    if existing_trigger:
        logger.info(f"Trigger already exists for user {policy.user_id}, type {trigger['trigger_type']}")
        return None
    
    new_trigger = Trigger(
        user_id=policy.user_id,
        trigger_type=trigger["trigger_type"],
        trigger_value=trigger["trigger_value"],
        zone=trigger["zone"],
        status="detected"
    )
    db.add(new_trigger)
    db.flush()
    
    create_notification(
        db,
        policy.user_id,
        f"Trigger Detected: {trigger['trigger_type']}",
        f"A {trigger['trigger_type']} event has been detected in {trigger['zone']}. Value: {trigger['trigger_value']}",
        "trigger"
    )
    
    claim = Claim(
        user_id=policy.user_id,
        trigger_id=new_trigger.id,
        claim_amount=trigger["claim_amount"],
        status="initiated"
    )
    db.add(claim)
    db.flush()
    
    create_notification(
        db,
        policy.user_id,
        "Claim Created",
        f"Your claim for {trigger['trigger_type']} has been initiated. Amount: ${trigger['claim_amount']}",
        "claim_created"
    )
    
    fraud_result = evaluate_claim_fraud(policy.user_id, claim.id, db)
    
    fraud_log = FraudLog(
        user_id=policy.user_id,
        claim_id=claim.id,
        fraud_score=fraud_result["fraud_score"],
        fraud_status=fraud_result["fraud_status"],
        reason=fraud_result["reason"]
    )
    db.add(fraud_log)
    
    if fraud_result["fraud_status"] == "suspicious":
        claim.status = "rejected"
        db.flush()
        
        create_notification(
            db,
            policy.user_id,
            "Claim Rejected - Fraud Detection",
            f"Your claim has been rejected due to fraud detection. Reason: {fraud_result['reason']}",
            "claim_rejected"
        )
        logger.info(f"Claim {claim.id} rejected due to fraud suspicion")
        return None
    
    claim.status = "approved"
    db.flush()
    
    payout = Payout(
        claim_id=claim.id,
        amount=trigger["claim_amount"],
        payout_method="UPI",
        status="completed"
    )
    db.add(payout)
    db.flush()
    
    create_notification(
        db,
        policy.user_id,
        "Payout Completed",
        f"Your payout of ${trigger['claim_amount']} has been processed successfully!",
        "payout_completed"
    )
    
    logger.info(f"Completed process for user {policy.user_id}: Trigger -> Claim -> Fraud Check -> Payout")
    return {
        "trigger_id": new_trigger.id,
        "claim_id": claim.id,
        "payout_id": payout.id,
        "amount": trigger["claim_amount"]
    }


def process_real_weather_trigger(db: Session, user: User, weather: str):
    if "rain" in weather:
        trigger_type = "Heavy Rain"
        claim_amount = 500
    elif "storm" in weather:
        trigger_type = "Storm"
        claim_amount = 500
    else:
        return None

    if is_recent_trigger(db, user.id, trigger_type, user.zone):
        logger.info(f"Recent trigger exists for user {user.id}, type {trigger_type}")
        return None

    new_trigger = Trigger(
        user_id=user.id,
        trigger_type=trigger_type,
        trigger_value=1.0,
        zone=user.zone,
        status="detected"
    )
    db.add(new_trigger)
    db.flush()

    create_notification(
        db,
        user.id,
        f"Weather Alert: {trigger_type}",
        f"{trigger_type} detected in {user.city} → ₹{claim_amount} credited",
        "weather_alert"
    )

    claim = Claim(
        user_id=user.id,
        trigger_id=new_trigger.id,
        claim_amount=claim_amount,
        status="approved"
    )
    db.add(claim)
    db.flush()

    payout = Payout(
        claim_id=claim.id,
        amount=claim_amount,
        payout_method=user.payout_method,
        status="completed"
    )
    db.add(payout)

    create_notification(
        db,
        user.id,
        "Payout Completed",
        f"Your payout of ₹{claim_amount} has been processed successfully!",
        "payout_completed"
    )

    logger.info(f"Real weather trigger processed for user {user.id}: {trigger_type}")
    return {
        "trigger_id": new_trigger.id,
        "claim_id": claim.id,
        "payout_id": payout.id,
        "amount": claim_amount
    }


def run_scheduler_job():
    logger.info("=" * 50)
    logger.info("Starting scheduler job - " + datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
    logger.info("=" * 50)
    
    db = SessionLocal()
    try:
        weather_data = get_weather_data()
        aqi_data = get_aqi_data()
        traffic_data = get_traffic_data()
        
        logger.info(f"Weather data fetched: {list(weather_data.keys())}")
        logger.info(f"AQI data fetched: {list(aqi_data.keys())}")
        logger.info(f"Traffic data fetched: {list(traffic_data.keys())}")
        
        detected_triggers = detect_triggers(weather_data, aqi_data, traffic_data)
        logger.info(f"Detected {len(detected_triggers)} triggers")
        
        if not detected_triggers:
            logger.info("No triggers detected in this cycle")
        
        policies = get_active_policies(db)
        logger.info(f"Found {len(policies)} active policies")
        
        results = []
        for policy in policies:
            for trigger in detected_triggers:
                result = process_trigger_for_policy(db, policy, trigger)
                if result:
                    results.append(result)
        
        db.commit()
        logger.info(f"Processed {len(results)} trigger->claim->payout flows")
        logger.info("Scheduler job completed successfully")
        
    except Exception as e:
        logger.error(f"Error in scheduler job: {str(e)}")
        db.rollback()
        raise
    finally:
        db.close()


def check_real_weather():
    logger.info("Checking real weather for users...")
    db = SessionLocal()
    try:
        users = db.query(User).all()
        for user in users:
            if not user.city:
                continue
            weather = get_weather(user.city)
            if weather:
                logger.info(f"Weather in {user.city}: {weather}")
                if "rain" in weather or "storm" in weather:
                    result = process_real_weather_trigger(db, user, weather)
                    if result:
                        logger.info(f"Real weather trigger processed for user {user.id}")
        db.commit()
    except Exception as e:
        logger.error(f"Error in real weather check: {str(e)}")
        db.rollback()
    finally:
        db.close()


def clean_old_data():
    db = SessionLocal()
    try:
        one_hour_ago = datetime.utcnow() - timedelta(hours=1)
        db.query(Notification).filter(
            Notification.created_at < one_hour_ago
        ).delete()
        db.query(Trigger).filter(
            Trigger.created_at < one_hour_ago
        ).delete()
        db.commit()
        logger.info("Old data cleaned successfully")
    except Exception as e:
        logger.error(f"Error cleaning old data: {str(e)}")
        db.rollback()
    finally:
        db.close()


def start_scheduler():
    scheduler.add_job(run_scheduler_job, 'interval', minutes=5)
    scheduler.add_job(check_real_weather, 'interval', minutes=20)
    scheduler.add_job(clean_old_data, 'interval', minutes=60)
    scheduler.start()
    logger.info("Scheduler started successfully")


def run_scheduler_job_manual():
    logger.info("Manually triggering scheduler job...")
    run_scheduler_job()
    return {"message": "Scheduler job executed successfully"}


def get_scheduler_status():
    return {
        "scheduler_running": True,
        "interval": "5 minutes (mock), 20 minutes (real weather)",
        "next_run": "Continuous",
        "functions": [
            "Fetch mock weather data",
            "Fetch mock AQI data",
            "Fetch mock traffic data",
            "Detect trigger conditions",
            "Create triggers for active policies",
            "Create claims",
            "Run fraud detection",
            "Process payouts",
            "Send notifications",
            "Check real weather API",
            "Clean old data"
        ]
    }
