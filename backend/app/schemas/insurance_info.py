from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class InsuranceInfoBase(BaseModel):
    title: str
    category: str
    content: str
    order_index: int = 0
    icon: Optional[str] = None


class InsuranceInfoCreate(InsuranceInfoBase):
    pass


class InsuranceInfoUpdate(BaseModel):
    title: Optional[str] = None
    category: Optional[str] = None
    content: Optional[str] = None
    order_index: Optional[int] = None
    icon: Optional[str] = None


class InsuranceInfoResponse(InsuranceInfoBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class InsuranceInfoByCategory(BaseModel):
    category: str
    items: list[InsuranceInfoResponse]