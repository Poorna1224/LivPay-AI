from pydantic import BaseModel


class PayoutResponse(BaseModel):
    id: int
    claim_id: int
    amount: float
    payout_method: str
    status: str

    class Config:
        from_attributes = True
