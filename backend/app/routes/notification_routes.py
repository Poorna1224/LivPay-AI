from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.notification import (
    NotificationResponse,
    NotificationCreate,
    NotificationUpdate
)
from app.services import notification_service
from app.models.notification import Notification
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/notifications", tags=["Notifications"])


@router.get("/user/{user_id}", response_model=list[NotificationResponse])
def get_user_notifications(
    user_id: int,
    skip: int = 0,
    limit: int = 50,
    unread_only: bool = False,
    db: Session = Depends(get_db)
):
    """Get all notifications for a user."""
    return notification_service.get_user_notifications(
        db, user_id, skip, limit, unread_only
    )


@router.get("/user/{user_id}/unread-count")
def get_unread_count(user_id: int, db: Session = Depends(get_db)):
    """Get count of unread notifications."""
    count = notification_service.get_unread_count(db, user_id)
    return {"unread_count": count}


@router.get("/init-tables")
def init_tables(db: Session = Depends(get_db)):
    """Initialize notification tables."""
    from app.database import Base, engine
    Base.metadata.create_all(bind=engine)
    return {"message": "Tables initialized"}


@router.post("", response_model=NotificationResponse)
def create_notification(data: NotificationCreate, db: Session = Depends(get_db)):
    """Create a new notification."""
    try:
        logger.info(f"Creating notification: user_id={data.user_id}, title={data.title}, type={data.notification_type}")
        notification = notification_service.create_notification(
            db,
            data.user_id,
            data.title,
            data.message,
            data.notification_type
        )
        logger.info(f"Notification created: {notification.id}")
        return notification
    except Exception as e:
        logger.error(f"Error creating notification: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/{notification_id}/read", response_model=NotificationResponse)
def mark_as_read(
    notification_id: int,
    user_id: int,
    db: Session = Depends(get_db)
):
    """Mark a notification as read."""
    notification = notification_service.mark_as_read(db, notification_id, user_id)
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    return notification


@router.put("/user/{user_id}/read-all")
def mark_all_as_read(user_id: int, db: Session = Depends(get_db)):
    """Mark all notifications as read for a user."""
    count = notification_service.mark_all_as_read(db, user_id)
    return {"marked_read": count}


@router.delete("/{notification_id}")
def delete_notification(
    notification_id: int,
    user_id: int,
    db: Session = Depends(get_db)
):
    """Delete a notification."""
    success = notification_service.delete_notification(db, notification_id, user_id)
    if not success:
        raise HTTPException(status_code=404, detail="Notification not found")
    return {"message": "Notification deleted"}