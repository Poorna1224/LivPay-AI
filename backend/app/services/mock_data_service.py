import random
from datetime import datetime
from typing import Dict, List, Any


# Mock Weather Data - simulates weather API response
def get_weather_data(city: str = None) -> Dict[str, Any]:
    """
    Returns mock weather data for various cities and zones.
    In production, this would call a real weather API.
    """
    weather_conditions = [
        {"condition": "Clear", "temp_min": 25, "temp_max": 35},
        {"condition": "Cloudy", "temp_min": 22, "temp_max": 30},
        {"condition": "Light Rain", "temp_min": 20, "temp_max": 28},
        {"condition": "Heavy Rain", "temp_min": 18, "temp_max": 25},
        {"condition": "Heatwave", "temp_min": 38, "temp_max": 45},
        {"condition": "Storm", "temp_min": 20, "temp_max": 26},
    ]
    
    cities_data = {
        "hyderabad": {
            "zones": {
                "ameerpet": random.choice(weather_conditions),
                "gachibowli": random.choice(weather_conditions),
                "madhapur": random.choice(weather_conditions),
                " Jubilee Hills": random.choice(weather_conditions),
                "banjara hills": random.choice(weather_conditions),
            }
        },
        "chennai": {
            "zones": {
                "t Nagar": random.choice(weather_conditions),
                "anna nagar": random.choice(weather_conditions),
                " Mylapore": random.choice(weather_conditions),
            }
        },
        "bangalore": {
            "zones": {
                "mg Road": random.choice(weather_conditions),
                "whitefield": random.choice(weather_conditions),
                "koramangala": random.choice(weather_conditions),
            }
        },
    }
    
    result = {}
    for city_name, data in cities_data.items():
        if city and city.lower() != city_name:
            continue
        result[city_name] = {
            "temperature": random.randint(25, 40),
            "humidity": random.randint(40, 90),
            "wind_speed": random.randint(5, 30),
            "zones": {}
        }
        for zone, condition in data["zones"].items():
            result[city_name]["zones"][zone] = {
                "condition": condition["condition"],
                "temperature": random.randint(condition["temp_min"], condition["temp_max"]),
                "precipitation": random.randint(0, 100) if "Rain" in condition["condition"] else 0,
                "timestamp": datetime.now().isoformat()
            }
    
    return result


# Mock AQI (Air Quality Index) Data
def get_aqi_data(city: str = None) -> Dict[str, Any]:
    """
    Returns mock AQI data for various cities and zones.
    AQI Categories:
    0-50: Good (Green)
    51-100: Moderate (Yellow)
    101-150: Unhealthy for Sensitive Groups (Orange)
    151-200: Unhealthy (Red)
    201-300: Very Unhealthy (Purple)
    301-500: Hazardous (Maroon)
    """
    
    aqi_ranges = [
        {"category": "Good", "range": (20, 50)},
        {"category": "Moderate", "range": (51, 100)},
        {"category": "Unhealthy for Sensitive", "range": (101, 150)},
        {"category": "Unhealthy", "range": (151, 200)},
        {"category": "Very Unhealthy", "range": (201, 300)},
        {"category": "Hazardous", "range": (301, 400)},
    ]
    
    cities_data = {
        "hyderabad": {
            "ameerpet": random.choice(aqi_ranges),
            "gachibowli": random.choice(aqi_ranges),
            "madhapur": random.choice(aqi_ranges),
            " Jubilee Hills": random.choice(aqi_ranges),
            "banjara hills": random.choice(aqi_ranges),
        },
        "chennai": {
            "t Nagar": random.choice(aqi_ranges),
            "anna nagar": random.choice(aqi_ranges),
            " Mylapore": random.choice(aqi_ranges),
        },
        "bangalore": {
            "mg Road": random.choice(aqi_ranges),
            "whitefield": random.choice(aqi_ranges),
            "koramangala": random.choice(aqi_ranges),
        },
    }
    
    result = {}
    for city_name, zones_data in cities_data.items():
        if city and city.lower() != city_name:
            continue
        result[city_name] = {"zones": {}}
        for zone, aqi_info in zones_data.items():
            aqi_value = random.randint(aqi_info["range"][0], aqi_info["range"][1])
            result[city_name]["zones"][zone] = {
                "aqi": aqi_value,
                "category": aqi_info["category"],
                "pm25": random.randint(10, 200),
                "pm10": random.randint(20, 300),
                "timestamp": datetime.now().isoformat()
            }
    
    return result


# Mock Traffic Data
def get_traffic_data(city: str = None) -> Dict[str, Any]:
    """
    Returns mock traffic data for various cities and zones.
    Traffic Level: 1 (Low) to 5 (Severe)
    """
    
    traffic_levels = [
        {"level": 1, "label": "Low", "avg_speed": 40},
        {"level": 2, "label": "Moderate", "avg_speed": 30},
        {"level": 3, "label": "Heavy", "avg_speed": 20},
        {"level": 4, "label": "Severe", "avg_speed": 10},
        {"level": 5, "label": "Gridlock", "avg_speed": 5},
    ]
    
    cities_data = {
        "hyderabad": {
            "ameerpet": random.choice(traffic_levels),
            "gachibowli": random.choice(traffic_levels),
            "madhapur": random.choice(traffic_levels),
            " Jubilee Hills": random.choice(traffic_levels),
            "banjara hills": random.choice(traffic_levels),
        },
        "chennai": {
            "t Nagar": random.choice(traffic_levels),
            "anna nagar": random.choice(traffic_levels),
            " Mylapore": random.choice(traffic_levels),
        },
        "bangalore": {
            "mg Road": random.choice(traffic_levels),
            "whitefield": random.choice(traffic_levels),
            "koramangala": random.choice(traffic_levels),
        },
    }
    
    result = {}
    for city_name, zones_data in cities_data.items():
        if city and city.lower() != city_name:
            continue
        result[city_name] = {"zones": {}}
        for zone, traffic_info in zones_data.items():
            result[city_name]["zones"][zone] = {
                "level": traffic_info["level"],
                "label": traffic_info["label"],
                "average_speed": traffic_info["avg_speed"],
                "congestion_percentage": random.randint(20, 95),
                "timestamp": datetime.now().isoformat()
            }
    
    return result


# Combined mock data for scheduler
def get_all_mock_data() -> Dict[str, Any]:
    """
    Returns all mock data for weather, AQI, and traffic.
    """
    return {
        "weather": get_weather_data(),
        "aqi": get_aqi_data(),
        "traffic": get_traffic_data(),
        "timestamp": datetime.now().isoformat()
    }


# Example trigger detection thresholds
TRIGGER_THRESHOLDS = {
    "weather": {
        "heavy_rain": {"precipitation": 50, "claim_amount": 200},
        "heatwave": {"temperature": 40, "claim_amount": 180},
        "storm": {"wind_speed": 25, "claim_amount": 150},
    },
    "aqi": {
        "unhealthy": {"aqi": 151, "claim_amount": 150},
        "very_unhealthy": {"aqi": 201, "claim_amount": 200},
        "hazardous": {"aqi": 301, "claim_amount": 250},
    },
    "traffic": {
        "severe": {"level": 4, "claim_amount": 100},
        "gridlock": {"level": 5, "claim_amount": 150},
    },
}


def detect_triggers(weather_data: Dict, aqi_data: Dict, traffic_data: Dict) -> List[Dict]:
    """
    Analyzes mock data and detects trigger conditions.
    Returns list of detected triggers.
    """
    detected_triggers = []
    
    for city, weather in weather_data.items():
        for zone, data in weather.get("zones", {}).items():
            # Check weather triggers
            if data.get("condition") == "Heavy Rain" and data.get("precipitation", 0) >= 50:
                detected_triggers.append({
                    "trigger_type": "Heavy Rain",
                    "trigger_value": data.get("precipitation", 0),
                    "zone": zone,
                    "city": city,
                    "source": "weather",
                    "claim_amount": 200
                })
            
            if data.get("condition") == "Heatwave" and data.get("temperature", 0) >= 40:
                detected_triggers.append({
                    "trigger_type": "Heatwave",
                    "trigger_value": data.get("temperature", 0),
                    "zone": zone,
                    "city": city,
                    "source": "weather",
                    "claim_amount": 180
                })
    
    for city, aqi in aqi_data.items():
        for zone, data in aqi.get("zones", {}).items():
            aqi_value = data.get("aqi", 0)
            if aqi_value >= 301:
                detected_triggers.append({
                    "trigger_type": "Hazardous AQI",
                    "trigger_value": aqi_value,
                    "zone": zone,
                    "city": city,
                    "source": "aqi",
                    "claim_amount": 250
                })
            elif aqi_value >= 201:
                detected_triggers.append({
                    "trigger_type": "Very Unhealthy AQI",
                    "trigger_value": aqi_value,
                    "zone": zone,
                    "city": city,
                    "source": "aqi",
                    "claim_amount": 200
                })
            elif aqi_value >= 151:
                detected_triggers.append({
                    "trigger_type": "Unhealthy AQI",
                    "trigger_value": aqi_value,
                    "zone": zone,
                    "city": city,
                    "source": "aqi",
                    "claim_amount": 150
                })
    
    for city, traffic in traffic_data.items():
        for zone, data in traffic.get("zones", {}).items():
            level = data.get("level", 0)
            if level >= 4:
                detected_triggers.append({
                    "trigger_type": f"Traffic {data.get('label')}",
                    "trigger_value": level,
                    "zone": zone,
                    "city": city,
                    "source": "traffic",
                    "claim_amount": 150 if level == 5 else 100
                })
    
    return detected_triggers