# LivPay AI

AI-Based Parametric Insurance Platform for Gig Workers

## Project Overview
LivPay AI is a full-stack insurance platform designed for gig workers such as Swiggy, Zomato, Uber, and delivery partners. It uses AI-driven risk prediction and trigger-based automation to protect workers from income loss caused by disruption events like rain, pollution, extreme temperature, traffic, and platform demand fluctuations.

## Problem Statement
Gig workers depend on daily earnings and are highly vulnerable to sudden disruptions that reduce their income. Traditional insurance is too slow, manual, and inaccessible for this use case. A faster and more automated protection system is needed.

## Solution
LivPay AI provides a parametric insurance workflow where:
- workers register and purchase protection policies,
- premiums are adjusted using AI risk scoring,
- disruption triggers are detected automatically,
- claims are created from triggers,
- fraud checks run before payouts,
- payouts are processed with minimal manual intervention.

## Key Features
- Worker registration and onboarding
- Worker dashboard for policies, claims, and risk visibility
- Admin dashboard for monitoring operations
- Policy creation and premium recommendation
- Trigger detection for weather and environmental conditions
- Claim creation from triggers
- Fraud detection and risk flagging
- Payout processing
- AI income loss prediction workflow

## AI Income Loss Predictor
The platform includes an AI income loss predictor powered by a Random Forest model. It estimates a worker's income disruption risk based on:
- city risk
- zone risk
- weekly income
- rainfall
- AQI
- temperature
- working hours
- orders per day
- traffic index
- platform demand index

Outputs include:
- income loss risk score
- risk level
- alert message
- suggested action
- premium adjustment signals

## System Architecture
Architecture documentation is available here:
- [System Architecture Diagram](c:/Users/HP/Desktop/livpay-ai/docs/architecture/system-architecture-diagram.md)
- [Database Schema Diagram](c:/Users/HP/Desktop/livpay-ai/docs/architecture/database-schema-diagram.md)
- [AI Model Workflow Diagram](c:/Users/HP/Desktop/livpay-ai/docs/architecture/ai-model-workflow-diagram.md)

High-level flow:
- Frontend React application sends requests to FastAPI backend
- FastAPI services read and write PostgreSQL-style domain entities
- AI predictor service loads the trained model from `ml/models`
- Trigger detection uses weather, AQI, traffic, and demand signals
- Claims flow through fraud detection and payout processing

## Tech Stack
- Frontend: React, Vite, Tailwind CSS
- Backend: FastAPI, Uvicorn, SQLAlchemy
- Database: PostgreSQL design, SQLite fallback in local config
- AI/ML: Python, Pandas, Scikit-learn, Random Forest

## Database Design
Core entities:
- Users
- Policies
- Triggers
- Claims
- Payouts
- Fraud Logs

Additional implementation entities currently present in the repo:
- Payments
- Notifications
- Insurance Info

See the full ER diagram in [database-schema-diagram.md](c:/Users/HP/Desktop/livpay-ai/docs/architecture/database-schema-diagram.md).

## AI Model Details
- Dataset generator: [generate_dataset.py](c:/Users/HP/Desktop/livpay-ai/ml/scripts/generate_dataset.py)
- Model training script: [train_model.py](c:/Users/HP/Desktop/livpay-ai/ml/scripts/train_model.py)
- Saved model: [income_loss_model.pkl](c:/Users/HP/Desktop/livpay-ai/ml/models/income_loss_model.pkl)
- Backend predictor service: [ai_predictor_service.py](c:/Users/HP/Desktop/livpay-ai/backend/app/services/ai_predictor_service.py)

The current implementation uses a saved `.pkl` model and exposes AI prediction endpoints through FastAPI.

## API Endpoints

### Users and Auth
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/admin/login`
- `GET /auth/me`

### Policies
- `POST /policies/`
- `GET /policies/user/{user_id}`

### Premium
- `GET /premium/user/{user_id}`

### Triggers
- `POST /triggers/check/{user_id}`
- `GET /triggers/user/{user_id}`

### Claims
- `POST /claims/create-from-trigger/{trigger_id}`
- `GET /claims/user/{user_id}`

### Payouts
- `POST /payouts/process/{claim_id}`
- `GET /payouts/claim/{claim_id}`

### Fraud
- `POST /fraud/check/{claim_id}`
- `GET /fraud/user/{user_id}`

### Dashboard
- `GET /dashboard/summary`
- `GET /dashboard/user/{user_id}`

### AI Predictor
- `GET /ai/income-loss/{user_id}`
- `POST /ai/income-loss/predict`

## Workflow
User -> Policy -> Premium -> Trigger -> Claim -> Fraud -> Payout

Detailed journey:
1. Worker registers on the platform
2. Premium engine calculates weekly premium based on risk
3. Worker creates a protection policy
4. Trigger detection engine checks disruption signals
5. Trigger is recorded for affected worker or zone
6. Claim is created from the trigger
7. Fraud engine evaluates suspicious behavior
8. Safe claims proceed to payout engine
9. Admin dashboard monitors the full process

## Screenshots
Add your product screenshots inside [docs/screenshots](c:/Users/HP/Desktop/livpay-ai/docs/screenshots).

Suggested screenshots:
- Landing page
- Worker registration
- Worker dashboard
- Policy page
- Claims page
- Admin dashboard

## Installation Steps

### Prerequisites
- Node.js 18+
- Python 3.10+
- pip

## How to Run Backend

```powershell
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend default URL:

```text
http://127.0.0.1:8000
```

## How to Run Frontend

```powershell
cd frontend
npm install
npm run dev
```

Frontend default URL:

```text
http://127.0.0.1:5173
```

## Project Structure

```text
livpay-ai/
├── backend/
│   ├── app/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── auth.py
│   │   ├── config.py
│   │   ├── database.py
│   │   └── main.py
├── frontend/
│   └── src/
│       ├── components/
│       ├── pages/
│       └── services/
├── ml/
│   ├── data/
│   ├── models/
│   └── scripts/
└── docs/
    ├── architecture/
    ├── demo/
    └── screenshots/
```

## Future Improvements
- Real PostgreSQL deployment and migrations
- Live external API integration for weather, AQI, and traffic
- More accurate risk modeling and retraining pipeline
- Notification center for workers
- Better admin analytics and operations monitoring
- Mobile-first worker experience

## Team / Author
Project: LivPay AI / GigShield

Team:
- R. Poorna Chandra
- T. Kavya
- A. Sahasra
- K. Sai Harshini
- K. Lakshmi Chersihma
