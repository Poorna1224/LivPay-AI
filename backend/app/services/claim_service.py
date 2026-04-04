def calculate_claim_amount(trigger_type: str):
    trigger_type = trigger_type.lower()

    if trigger_type == "heavy rain":
        return 200.0
    elif trigger_type == "high aqi":
        return 150.0
    elif trigger_type == "heatwave":
        return 180.0
    elif trigger_type == "local restriction":
        return 250.0
    else:
        return 100.0
