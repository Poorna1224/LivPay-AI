from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.database import Base


class Payout(Base):
    __tablename__ = "payouts"

    id = Column(Integer, primary_key=True, index=True)
    claim_id = Column(Integer, ForeignKey("claims.id"), nullable=False)
    amount = Column(Float, nullable=False)
    payout_method = Column(String, default="UPI")
    status = Column(String, default="processed")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
