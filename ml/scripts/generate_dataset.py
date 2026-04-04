import numpy as np
import pandas as pd
import os

np.random.seed(42)

NUM_ROWS = 600

city_risk = np.random.choice([1, 2], size=NUM_ROWS, p=[0.55, 0.45])
zone_risk = np.random.choice([1, 2], size=NUM_ROWS, p=[0.5, 0.5])
weekly_income = np.round(np.random.uniform(2000, 12000, size=NUM_ROWS), 2)
rainfall_mm = np.round(np.random.exponential(scale=15, size=NUM_ROWS), 1)
rainfall_mm = np.clip(rainfall_mm, 0, 150)
aqi = np.random.randint(30, 350, size=NUM_ROWS)
temperature_c = np.round(np.random.uniform(15, 48, size=NUM_ROWS), 1)
working_hours = np.round(np.random.uniform(3, 14, size=NUM_ROWS), 1)
orders_per_day = np.random.randint(5, 60, size=NUM_ROWS)
traffic_index = np.random.randint(1, 11, size=NUM_ROWS)
platform_demand_index = np.random.randint(1, 11, size=NUM_ROWS)

income_loss_risk = (
    city_risk * 8
    + zone_risk * 10
    + (weekly_income / 12000) * 12
    + (rainfall_mm / 150) * 22
    + (aqi / 350) * 15
    + ((temperature_c - 15) / 33) * 10
    - (working_hours / 14) * 8
    - (orders_per_day / 60) * 7
    + (traffic_index / 10) * 10
    - (platform_demand_index / 10) * 10
    + np.random.normal(0, 4, size=NUM_ROWS)
)

income_loss_risk = np.clip(np.round(income_loss_risk, 1), 0, 100)

df = pd.DataFrame({
    "city_risk": city_risk,
    "zone_risk": zone_risk,
    "weekly_income": weekly_income,
    "rainfall_mm": rainfall_mm,
    "aqi": aqi,
    "temperature_c": temperature_c,
    "working_hours": working_hours,
    "orders_per_day": orders_per_day,
    "traffic_index": traffic_index,
    "platform_demand_index": platform_demand_index,
    "income_loss_risk": income_loss_risk,
})

output_dir = os.path.join(os.path.dirname(__file__), "..", "data")
os.makedirs(output_dir, exist_ok=True)
output_path = os.path.join(output_dir, "income_loss_dataset.csv")
df.to_csv(output_path, index=False)
print(f"Dataset generated: {output_path}")
print(f"Rows: {len(df)}, Columns: {list(df.columns)}")
print(df.describe().to_string())
