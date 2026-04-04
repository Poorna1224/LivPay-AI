from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.database import Base


class Trigger(Base):
    __tablename__ = "triggers"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    trigger_type = Column(String, nullable=False)
    trigger_value = Column(Float, nullable=False)
    zone = Column(String, nullable=False)
    status = Column(String, default="detected")
    created_at = Column(DateTime(timezone=True), server_default=func.now())