from pydantic import BaseModel


class ClaimResponse(BaseModel):
    id: int
    user_id: int
    trigger_id: int
    claim_amount: float
    status: str

    class Config:
        from_attributes = True
