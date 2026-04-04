from sqlalchemy import Column, Integer, String, Float, DateTime, Enum
from sqlalchemy.sql import func
import enum
from app.database import Base


class UserRole(str, enum.Enum):
    worker = "worker"
    admin = "admin"


class VerificationStatus(str, enum.Enum):
    pending = "pending"
    verified = "verified"
    rejected = "rejected"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, nullable=True)
    password_hash = Column(String, nullable=False)
    name = Column(String, nullable=False)
    phone = Column(String, unique=True, nullable=False)
    city = Column(String, nullable=False)
    zone = Column(String, nullable=False)
    platform = Column(String, nullable=False)
    partner_id = Column(String, nullable=True)
    weekly_income = Column(Float, nullable=False)
    payout_method = Column(String, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.worker)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    aadhaar_number = Column(String, nullable=True)
    pan_number = Column(String, nullable=True)
    platform_proof_url = Column(String, nullable=True)
    earnings_proof_url = Column(String, nullable=True)
    verification_status = Column(Enum(VerificationStatus), default=VerificationStatus.pending)
    verified_at = Column(DateTime(timezone=True), nullable=True)
    verified_by = Column(Integer, nullable=True)
