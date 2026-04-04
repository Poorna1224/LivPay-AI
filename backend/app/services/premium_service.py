def calculate_premium(city: str, zone: str, weekly_income: float):
    risk_score = 0

    city = city.lower()
    zone = zone.lower()

    # City-based risk
    high_risk_cities = ["hyderabad", "mumbai", "chennai"]
    if city in high_risk_cities:
        risk_score += 2

    # Zone-based risk
    high_risk_zones = ["ameerpet", "madhapur", "kukatpally"]
    if zone in high_risk_zones:
        risk_score += 2

    # Weekly income-based adjustment
    if weekly_income >= 6000:
        risk_score += 2
    elif weekly_income >= 4000:
        risk_score += 1

    if risk_score <= 2:
        risk_level = "Low"
        weekly_premium = 20
        coverage_label = "Basic protection"
    elif risk_score <= 4:
        risk_level = "Medium"
        weekly_premium = 30
        coverage_label = "Moderate protection"
    else:
        risk_level = "High"
        weekly_premium = 40
        coverage_label = "High protection"

    coverage_amount = round(max(weekly_income * 0.25, weekly_premium * 25), 2)

    return {
        "risk_score": risk_score,
        "risk_level": risk_level,
        "weekly_premium": weekly_premium,
        "coverage_amount": coverage_amount,
        "coverage_label": coverage_label,
        "payment_frequency": "Weekly",
    }
