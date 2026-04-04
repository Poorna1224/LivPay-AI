from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from apscheduler.schedulers.background import BackgroundScheduler
from contextlib import asynccontextmanager
from app.database import engine, Base, SessionLocal
from app.config import CORS_ORIGINS
from app.routes.user_routes import router as user_router
from app.routes.policy_routes import router as policy_router
from app.routes.premium_route import router as premium_router
from app.routes.trigger_routes import router as trigger_router
from app.routes.claim_routes import router as claim_router
from app.routes.payout_routes import router as payout_router
from app.routes.fraud_routes import router as fraud_router
from app.routes.dashboard_routes import router as dashboard_router
from app.routes.ai_routes import router as ai_router
from app.routes.insurance_info_routes import router as insurance_info_router
from app.routes.notification_routes import router as notification_router
from app.routes.scheduler_routes import router as scheduler_router
from app.routes.payment_routes import router as payment_router
from app.routes.auth_routes import router as auth_router
from app.routes.admin_routes import router as admin_router
from app.models.user import User
from app.models.policy import Policy
from app.models.trigger import Trigger
from app.models.payout import Payout
from app.models.payment import Payment
from app.models.fraud_log import FraudLog
from app.models.insurance_info import InsuranceInfo
from app.models.notification import Notification
from app.services.scheduler_service import run_scheduler_job, check_real_weather, clean_old_data
from app.services.insurance_info_service import seed_insurance_info


scheduler = BackgroundScheduler()


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    
    scheduler.add_job(run_scheduler_job, "interval", minutes=5)
    scheduler.add_job(check_real_weather, "interval", minutes=20)
    scheduler.add_job(clean_old_data, "interval", minutes=60)
    scheduler.start()
    
    db = SessionLocal()
    try:
        seed_insurance_info(db)
    except Exception as e:
        print(f"Error seeding insurance info: {e}")
    finally:
        db.close()
    
    yield
    
    scheduler.shutdown()


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"message": "LivPay AI Backend Running Successfully"}


@app.get("/test-db")
def test_db():
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        return {"message": "Database connected successfully"}
    except Exception as e:
        return {"error": str(e)}


app.include_router(user_router)
app.include_router(policy_router)
app.include_router(premium_router)
app.include_router(trigger_router)
app.include_router(claim_router)
app.include_router(payout_router)
app.include_router(fraud_router)
app.include_router(dashboard_router)
app.include_router(ai_router)
app.include_router(insurance_info_router)
app.include_router(notification_router)
app.include_router(scheduler_router)
app.include_router(payment_router)
app.include_router(auth_router)
app.include_router(admin_router)
