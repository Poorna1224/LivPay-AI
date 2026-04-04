from sqlalchemy.orm import Session
from app.models.notification import Notification
from app.database import Base, engine
from typing import List, Optional

# Ensure tables exist
from app.models.user import User
from app.models.policy import Policy
Base.metadata.create_all(bind=engine)


DEFAULT_TITLES = {
    "trigger": "Trigger Detected",
    "claim": "Claim Update",
    "claim_created": "Claim Created",
    "claim_rejected": "Claim Rejected",
    "payout": "Payout Update",
    "payout_completed": "Payout Completed",
    "policy": "Policy Update"
}


def create_notification(
    db: Session,
    user_id: int,
    title: Optional[str],
    message: str,
    notification_type: str
) -> Notification:
    """Create a new notification for a user."""
    if title is None:
        title = DEFAULT_TITLES.get(notification_type, "Notification")
    
    notification = Notification(
        user_id=user_id,
        title=title,
        message=message,
        notification_type=notification_type
    )
    db.add(notification)
    db.commit()
    db.refresh(notification)
    return notification


def get_user_notifications(
    db: Session,
    user_id: int,
    skip: int = 0,
    limit: int = 50,
    unread_only: bool = False
) -> List[Notification]:
    """Get notifications for a specific user."""
    query = db.query(Notification).filter(Notification.user_id == user_id)
    
    if unread_only:
        query = query.filter(Notification.is_read == False)
    
    return query.order_by(Notification.created_at.desc()).offset(skip).limit(limit).all()


def get_unread_count(db: Session, user_id: int) -> int:
    """Get count of unread notifications for a user."""
    return db.query(Notification).filter(
        Notification.user_id == user_id,
        Notification.is_read == False
    ).count()


def mark_as_read(db: Session, notification_id: int, user_id: int) -> Optional[Notification]:
    """Mark a notification as read."""
    notification = db.query(Notification).filter(
        Notification.id == notification_id,
        Notification.user_id == user_id
    ).first()
    
    if notification:
        notification.is_read = True
        db.commit()
        db.refresh(notification)
    
    return notification


def mark_all_as_read(db: Session, user_id: int) -> int:
    """Mark all notifications as read for a user."""
    result = db.query(Notification).filter(
        Notification.user_id == user_id,
        Notification.is_read == False
    ).update({"is_read": True})
    db.commit()
    return result


def delete_notification(db: Session, notification_id: int, user_id: int) -> bool:
    """Delete a notification."""
    notification = db.query(Notification).filter(
        Notification.id == notification_id,
        Notification.user_id == user_id
    ).first()
    
    if notification:
        db.delete(notification)
        db.commit()
        return True
    
    return False