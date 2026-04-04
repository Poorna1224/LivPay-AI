from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.insurance_info import (
    InsuranceInfoResponse,
    InsuranceInfoByCategory,
    InsuranceInfoCreate,
    InsuranceInfoUpdate
)
from app.services import insurance_info_service

router = APIRouter(prefix="/insurance-info", tags=["Insurance Information"])


@router.get("", response_model=list[InsuranceInfoResponse])
def get_all_info(db: Session = Depends(get_db)):
    """Get all insurance information."""
    return insurance_info_service.get_all_insurance_info(db)


@router.get("/categories", response_model=list[str])
def get_categories(db: Session = Depends(get_db)):
    """Get all available categories."""
    categories = insurance_info_service.get_categories(db)
    return [c[0] for c in categories]


@router.get("/by-category/{category}", response_model=list[InsuranceInfoResponse])
def get_info_by_category(category: str, db: Session = Depends(get_db)):
    """Get insurance information by category."""
    return insurance_info_service.get_insurance_info_by_category(db, category)


@router.get("/grouped", response_model=dict[str, list[InsuranceInfoResponse]])
def get_grouped_info(db: Session = Depends(get_db)):
    """Get insurance information grouped by category."""
    grouped = insurance_info_service.get_insurance_info_grouped(db)
    return grouped


@router.get("/seed")
def seed_info(db: Session = Depends(get_db)):
    """Seed default insurance information."""
    insurance_info_service.seed_insurance_info(db)
    return {"message": "Insurance information seeded successfully"}


@router.post("", response_model=InsuranceInfoResponse)
def create_info(data: InsuranceInfoCreate, db: Session = Depends(get_db)):
    """Create new insurance information entry."""
    info = insurance_info_service.seed_insurance_info.__self__.__class__(
        **data.model_dump()
    )
    from app.models.insurance_info import InsuranceInfo
    info = InsuranceInfo(**data.model_dump())
    db.add(info)
    db.commit()
    db.refresh(info)
    return info


@router.put("/{info_id}", response_model=InsuranceInfoResponse)
def update_info(info_id: int, data: InsuranceInfoUpdate, db: Session = Depends(get_db)):
    """Update insurance information entry."""
    from app.models.insurance_info import InsuranceInfo
    info = db.query(InsuranceInfo).filter(InsuranceInfo.id == info_id).first()
    if not info:
        return {"error": "Information not found"}
    
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(info, key, value)
    
    db.commit()
    db.refresh(info)
    return info