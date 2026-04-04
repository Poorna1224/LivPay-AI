from sqlalchemy.orm import Session
from typing import List, Dict
from app.models.insurance_info import InsuranceInfo


# Default insurance information data
DEFAULT_INSURANCE_INFO = [
    # Policy Explanation
    {
        "title": "What is LivPay AI?",
        "category": "policy_explanation",
        "content": "LivPay AI is a parametric insurance system that provides automatic payouts based on predefined trigger conditions like weather events, air quality index (AQI), and traffic disruptions. Unlike traditional insurance that requires manual claims, LivPay AI automatically monitors conditions and processes payouts when triggers are activated.",
        "order_index": 1,
        "icon": "shield-check"
    },
    {
        "title": "How Does Coverage Work?",
        "category": "policy_explanation",
        "content": "When you purchase a policy, you select a coverage amount and pay a weekly premium. Your policy is active as long as you continue paying premiums. When trigger conditions are met in your area (zone), an automatic claim is generated and processed.",
        "order_index": 2,
        "icon": "document-text"
    },
    {
        "title": "Coverage Benefits",
        "category": "policy_explanation",
        "content": "- Automatic claim processing without paperwork\n- Instant payouts when triggers activate\n- Coverage for weather, AQI, and traffic disruptions\n- No deductible or excess fees\n- 24/7 monitoring and protection",
        "order_index": 3,
        "icon": "gift"
    },
    
    # Premium Calculation
    {
        "title": "How Premium is Calculated",
        "category": "premium_calculation",
        "content": "Your weekly premium is calculated based on:\n\n1. Coverage Amount: Higher coverage = higher premium\n2. Zone Risk Level: High-risk zones have higher premiums\n3. Number of Triggers: More trigger types covered = higher premium\n4. Policy Duration: Longer commitment may reduce premium",
        "order_index": 1,
        "icon": "calculator"
    },
    {
        "title": "Premium Factors",
        "category": "premium_calculation",
        "content": "Base Premium = (Coverage Amount × Risk Factor) / Coverage Multiplier\n\nExample:\n- Coverage: $10,000\n- Zone: Ameerpet (Medium Risk)\n- Risk Factor: 0.02\n- Weekly Premium: $200",
        "order_index": 2,
        "icon": "trending-up"
    },
    {
        "title": "Payment Schedule",
        "category": "premium_calculation",
        "content": "Premiums are paid weekly in advance. You can enable auto-renew to ensure continuous coverage. If payment fails, there is a 7-day grace period before coverage is suspended.",
        "order_index": 3,
        "icon": "calendar"
    },
    
    # Trigger Conditions
    {
        "title": "Weather Triggers",
        "category": "trigger_conditions",
        "content": "Weather triggers activate when severe weather conditions are detected in your zone:\n\n- Heavy Rain: Precipitation > 50mm/hour\n- Heatwave: Temperature > 40°C\n- Storm: Wind speed > 25 km/h\n- Flood: Water level above threshold",
        "order_index": 1,
        "icon": "cloud"
    },
    {
        "title": "AQI Triggers",
        "category": "trigger_conditions",
        "content": "Air Quality Index triggers activate based on pollution levels:\n\n- Unhealthy: AQI 151-200\n- Very Unhealthy: AQI 201-300\n- Hazardous: AQI 301+\n\nThe system monitors PM2.5, PM10, and overall AQI.",
        "order_index": 2,
        "icon": "leaf"
    },
    {
        "title": "Traffic Triggers",
        "category": "trigger_conditions",
        "content": "Traffic disruption triggers activate when congestion reaches severe levels:\n\n- Severe: Level 4 (traffic almost stopped)\n- Gridlock: Level 5 (complete standstill)\n\nTraffic is monitored through zone-based sensors and historical data.",
        "order_index": 3,
        "icon": "car"
    },
    {
        "title": "Zone Coverage",
        "category": "trigger_conditions",
        "content": "Your policy covers triggers in your registered zone. You can update your zone through the app. Available zones include:\n\n- Hyderabad: Ameerpet, Gachibowli, Madhapur, Jubilee Hills\n- Chennai: T Nagar, Anna Nagar, Mylapore\n- Bangalore: MG Road, Whitefield, Koramangala",
        "order_index": 4,
        "icon": "map"
    },
    
    # Claim Process
    {
        "title": "How Claims Are Created",
        "category": "claim_process",
        "content": "Claims are created automatically when trigger conditions are met:\n\n1. System monitors weather, AQI, and traffic data\n2. When trigger threshold is exceeded, it's recorded\n3. System creates a claim linked to your policy\n4. Fraud detection runs automatically\n5. Approved claims proceed to payout",
        "order_index": 1,
        "icon": "clipboard"
    },
    {
        "title": "Claim Status Tracking",
        "category": "claim_process",
        "content": "You can track your claim status through the app:\n\n- Initiated: Claim created, pending review\n- Under Review: Fraud detection in progress\n- Approved: Claim verified and approved\n- Rejected: Claim failed fraud check\n- Paid: Payout completed",
        "order_index": 2,
        "icon": "time"
    },
    {
        "title": "Claim Amounts",
        "category": "claim_process",
        "content": "Claim amounts are predetermined based on trigger type:\n\n- Heavy Rain: $200\n- Heatwave: $180\n- High AQI: $150\n- Very Unhealthy AQI: $200\n- Hazardous AQI: $250\n- Severe Traffic: $100\n- Gridlock: $150\n\nAmounts are fixed per trigger type.",
        "order_index": 3,
        "icon": "cash"
    },
    {
        "title": "Claim Limits",
        "category": "claim_process",
        "content": "There is no limit on the number of claims you can make. However, fraud detection may flag users with unusually high claim frequency. Each claim is evaluated individually for fraud risk.",
        "order_index": 4,
        "icon": "infinite"
    },
    
    # Fraud Detection
    {
        "title": "How Fraud Detection Works",
        "category": "fraud_detection",
        "content": "Our fraud detection system analyzes each claim for suspicious patterns:\n\n- Claim frequency: Too many claims triggers review\n- Claim amounts: Unusually high amounts are flagged\n- User history: First claims get baseline risk score\n- Pattern matching: Unusual patterns detected",
        "order_index": 1,
        "icon": "shield"
    },
    {
        "title": "Fraud Score Calculation",
        "category": "fraud_detection",
        "content": "Fraud score is calculated on a 0-100 scale:\n\n- 0-49: Normal - Auto approved\n- 50-79: Review - Manual verification needed\n- 80-100: Suspicious - Claim rejected\n\nFactors:\n- +50 points: More than 3 claims\n- +30 points: Claim > $220\n- +5 points: First claim (baseline)",
        "order_index": 2,
        "icon": "analytics"
    },
    {
        "title": "False Positive Prevention",
        "category": "fraud_detection",
        "content": "To minimize false positives:\n\n- Multiple data sources verify triggers\n- Human review available for borderline cases\n- Appeal process for rejected claims\n- Transparent scoring explained in notifications",
        "order_index": 3,
        "icon": "people"
    },
    {
        "title": "Reporting Fraud",
        "category": "fraud_detection",
        "content": "If you suspect fraudulent activity:\n\n1. Contact support through the app\n2. Provide detailed information\n3. Our team investigates within 24 hours\n4. Confidentiality maintained throughout",
        "order_index": 4,
        "icon": "warning"
    }
]


def seed_insurance_info(db: Session):
    """Seed default insurance information if database is empty."""
    existing = db.query(InsuranceInfo).first()
    if existing:
        return
    
    for info in DEFAULT_INSURANCE_INFO:
        db.add(InsuranceInfo(**info))
    
    db.commit()


def get_all_insurance_info(db: Session) -> List[InsuranceInfo]:
    """Get all insurance information."""
    return db.query(InsuranceInfo).order_by(InsuranceInfo.order_index).all()


def get_insurance_info_by_category(db: Session, category: str) -> List[InsuranceInfo]:
    """Get insurance information by category."""
    return db.query(InsuranceInfo).filter(
        InsuranceInfo.category == category
    ).order_by(InsuranceInfo.order_index).all()


def get_categories(db: Session) -> List[str]:
    """Get all available categories."""
    return db.query(InsuranceInfo.category).distinct().all()


def get_insurance_info_grouped(db: Session) -> Dict[str, List[InsuranceInfo]]:
    """Get insurance information grouped by category."""
    info = get_all_insurance_info(db)
    grouped = {}
    
    for item in info:
        if item.category not in grouped:
            grouped[item.category] = []
        grouped[item.category].append(item)
    
    return grouped