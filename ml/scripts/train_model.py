import os
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score
import joblib

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(SCRIPT_DIR, "..", "data", "income_loss_dataset.csv")
MODEL_DIR = os.path.join(SCRIPT_DIR, "..", "models")
MODEL_PATH = os.path.join(MODEL_DIR, "income_loss_model.pkl")

FEATURES = [
    "city_risk",
    "zone_risk",
    "weekly_income",
    "rainfall_mm",
    "aqi",
    "temperature_c",
    "working_hours",
    "orders_per_day",
    "traffic_index",
    "platform_demand_index",
]
TARGET = "income_loss_risk"


def train():
    print("Loading dataset...")
    df = pd.read_csv(DATA_PATH)
    print(f"Dataset loaded: {df.shape[0]} rows, {df.shape[1]} columns")

    X = df[FEATURES]
    y = df[TARGET]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    print(f"Training set: {X_train.shape[0]} rows")
    print(f"Testing set:  {X_test.shape[0]} rows")

    print("\nTraining RandomForestRegressor...")
    model = RandomForestRegressor(
        n_estimators=200,
        max_depth=12,
        min_samples_split=5,
        min_samples_leaf=2,
        random_state=42,
        n_jobs=-1,
    )
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    mae = mean_absolute_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)

    print(f"\nModel Evaluation:")
    print(f"  MAE:  {mae:.4f}")
    print(f"  R2:   {r2:.4f}")

    print("\nFeature Importance:")
    importances = model.feature_importances_
    feature_importance = sorted(
        zip(FEATURES, importances), key=lambda x: x[1], reverse=True
    )
    for name, imp in feature_importance:
        print(f"  {name:>25s}: {imp:.4f}")

    os.makedirs(MODEL_DIR, exist_ok=True)
    joblib.dump(model, MODEL_PATH)
    print(f"\nModel saved to: {MODEL_PATH}")


if __name__ == "__main__":
    train()
