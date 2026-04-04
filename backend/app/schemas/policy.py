from pydantic import BaseModel


class PolicyCreate(BaseModel):
    user_id: int
    weekly_premium: float
    coverage_amount: float
    auto_renew: bool = False


class PolicyResponse(BaseModel):
    id: int
    user_id: int
    weekly_premium: float
    coverage_amount: float
    status: str
    auto_renew: bool

    class Config:
        from_attributes = True