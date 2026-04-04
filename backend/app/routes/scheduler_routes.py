from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.services import scheduler_service, mock_data_service
from app.services.mock_data_service import get_all_mock_data

router = APIRouter(prefix="/scheduler", tags=["Scheduler"])


@router.get("/status")
def get_status():
    """Get scheduler status and information."""
    return scheduler_service.get_scheduler_status()


@router.get("/mock-data")
def get_mock_data():
    """Get current mock data from all sources."""
    return get_all_mock_data()


@router.post("/trigger")
def trigger_manual():
    """Manually trigger the scheduler job."""
    return scheduler_service.run_scheduler_job_manual()


@router.get("/triggers/current")
def get_current_triggers():
    """Get current detected triggers from mock data."""
    data = get_all_mock_data()
    triggers = mock_data_service.detect_triggers(
        data["weather"],
        data["aqi"],
        data["traffic"]
    )
    return {
        "timestamp": data["timestamp"],
        "detected_triggers": triggers
    }