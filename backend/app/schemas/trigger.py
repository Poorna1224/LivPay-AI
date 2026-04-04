from pydantic import BaseModel


class TriggerResponse(BaseModel):
    id: int
    user_id: int
    trigger_type: str
    trigger_value: float
    zone: str
    status: str

    class Config:
        from_attributes = True