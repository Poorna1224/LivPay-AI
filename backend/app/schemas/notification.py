from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class NotificationBase(BaseModel):
    title: Optional[str] = None
    message: str
    notification_type: str = Field(alias="type")


class NotificationCreate(NotificationBase):
    user_id: int

    model_config = {"populate_by_name": True}


class NotificationUpdate(BaseModel):
    is_read: Optional[bool] = None


class NotificationResponse(NotificationBase):
    id: int
    user_id: int
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True