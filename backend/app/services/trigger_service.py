def evaluate_triggers(city: str, zone: str):
    city = city.lower()
    zone = zone.lower()

    triggers = []

    if city == "hyderabad" and zone == "ameerpet":
        triggers.append({
            "trigger_type": "Heavy Rain",
            "trigger_value": 65.0,
            "zone": zone
        })

        triggers.append({
            "trigger_type": "High AQI",
            "trigger_value": 320.0,
            "zone": zone
        })

    if city == "chennai":
        triggers.append({
            "trigger_type": "Heatwave",
            "trigger_value": 43.0,
            "zone": zone
        })

    if zone == "madhapur":
        triggers.append({
            "trigger_type": "Local Restriction",
            "trigger_value": 1.0,
            "zone": zone
        })

    return triggers