from sqlalchemy import Column, Integer, String, Float, DateTime, Enum
from sqlalchemy.sql import func
import enum
from app.database import Base


class PaymentStatus(str, enum.Enum):
    completed = "completed"
    pending = "pending"
    failed = "failed"


class PaymentType(str, enum.Enum):
    premium = "premium"
    payout = "payout"


class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False, index=True)
    amount = Column(Float, nullable=False)
    type = Column(Enum(PaymentType), nullable=False)
    status = Column(Enum(PaymentStatus), default=PaymentStatus.pending)
    date = Column(DateTime, default=func.now())
    transaction_id = Column(String, unique=True, nullable=True)
