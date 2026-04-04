from pydantic import BaseModel, field_validator
from typing import Optional
from datetime import datetime
from enum import Enum


class UserRole(str, Enum):
    worker = "worker"
    admin = "admin"


class VerificationStatus(str, Enum):
    pending = "pending"
    verified = "verified"
    rejected = "rejected"


class UserCreate(BaseModel):
    email: Optional[str] = None
    password: str
    name: str
    phone: str
    city: str
    zone: str
    platform: str
    partner_id: Optional[str] = None
    weekly_income: float
    payout_method: str
    aadhaar_number: Optional[str] = None
    pan_number: Optional[str] = None


class AdminCreate(BaseModel):
    name: str
    email: str
    phone: str
    admin_pin: str
    confirm_admin_pin: str

    @field_validator("admin_pin", "confirm_admin_pin")
    @classmethod
    def validate_admin_pin(cls, value: str) -> str:
        if not value.isdigit() or not 4 <= len(value) <= 6:
            raise ValueError("Admin PIN must be a 4 to 6 digit number")
        return value


class LoginRequest(BaseModel):
    phone: str
    password: str


class AdminLoginRequest(BaseModel):
    phone: str
    admin_pin: str

    @field_validator("admin_pin")
    @classmethod
    def validate_admin_pin(cls, value: str) -> str:
        if not value.isdigit() or not 4 <= len(value) <= 6:
            raise ValueError("Admin PIN must be a 4 to 6 digit number")
        return value


class AdminAccessRequest(BaseModel):
    name: str
    admin_pin: str

    @field_validator("name")
    @classmethod
    def validate_name(cls, value: str) -> str:
        value = value.strip()
        if len(value) < 2:
            raise ValueError("Admin name must be at least 2 characters")
        return value

    @field_validator("admin_pin")
    @classmethod
    def validate_admin_pin(cls, value: str) -> str:
        if not value.isdigit() or len(value) != 4:
            raise ValueError("Admin PIN must be exactly 4 digits")
        return value


class UserResponse(BaseModel):
    id: int
    email: Optional[str] = None
    name: str
    phone: str
    city: str
    zone: str
    platform: str
    partner_id: Optional[str] = None
    weekly_income: float
    payout_method: str
    role: UserRole
    aadhaar_number: Optional[str] = None
    pan_number: Optional[str] = None
    platform_proof_url: Optional[str] = None
    earnings_proof_url: Optional[str] = None
    verification_status: VerificationStatus
    created_at: datetime

    class Config:
        from_attributes = True


class KYCUpdate(BaseModel):
    aadhaar_number: Optional[str] = None
    pan_number: Optional[str] = None
    platform_proof_url: Optional[str] = None
    earnings_proof_url: Optional[str] = None


class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse
