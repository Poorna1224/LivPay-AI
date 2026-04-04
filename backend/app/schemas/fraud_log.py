from pydantic import BaseModel


class FraudLogResponse(BaseModel):
    id: int
    user_id: int
    claim_id: int
    fraud_score: float
    fraud_status: str
    reason: str

    class Config:
        from_attributes = True
