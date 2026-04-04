from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from enum import Enum


class PaymentStatus(str, Enum):
    completed = "completed"
    pending = "pending"
    failed = "failed"


class PaymentType(str, Enum):
    premium = "premium"
    payout = "payout"


class PaymentBase(BaseModel):
    user_id: int
    amount: float
    type: PaymentType


class PaymentCreate(PaymentBase):
    pass


class PaymentResponse(PaymentBase):
    id: int
    status: PaymentStatus
    date: datetime
    transaction_id: Optional[str] = None

    class Config:
        from_attributes = True
