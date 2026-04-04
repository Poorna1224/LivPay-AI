# LivPay AI System Architecture

This document captures the system architecture for the AI-based parametric insurance platform.

## Diagram Prompt

```text
Create a system architecture diagram for an AI-based parametric insurance platform called LivPay AI.

The system should include:

Frontend:
- React + Tailwind Worker Dashboard
- Admin Dashboard
- Claims Page
- Policy Page
- AI Predictor Dashboard

Backend:
- FastAPI Server
- Authentication Module
- Policy Engine
- Premium Calculation Engine
- Trigger Detection Engine
- Claims Engine
- Fraud Detection Engine
- Payout Engine
- Dashboard API
- AI Predictor Service

Database:
- PostgreSQL Database with tables:
  Users
  Policies
  Triggers
  Claims
  Payouts
  Fraud Logs

AI/ML:
- Income Loss Prediction Model (Random Forest)
- Dataset Generator
- Weather API
- AQI API
- Traffic API
- Platform Demand Data

Flow:
Frontend -> FastAPI Backend -> PostgreSQL Database
Backend -> AI Predictor Service -> ML Model
Backend -> Weather/AQI/Traffic APIs
Triggers -> Claims -> Fraud Check -> Payout

Make the architecture clean and modern like a startup system architecture diagram.
```

## Mermaid Architecture

```mermaid
flowchart LR
    subgraph Frontend[Frontend - React + Tailwind]
        W[Worker Dashboard]
        A[Admin Dashboard]
        C[Claims Page]
        P[Policy Page]
        R[AI Predictor Dashboard]
    end

    subgraph Backend[FastAPI Backend]
        AUTH[Authentication Module]
        POLICY[Policy Engine]
        PREMIUM[Premium Calculation Engine]
        TRIGGER[Trigger Detection Engine]
        CLAIMS[Claims Engine]
        FRAUD[Fraud Detection Engine]
        PAYOUT[Payout Engine]
        DASH[Dashboard API]
        AI[AI Predictor Service]
    end

    subgraph DB[PostgreSQL]
        U[(Users)]
        PO[(Policies)]
        T[(Triggers)]
        CL[(Claims)]
        PA[(Payouts)]
        FL[(Fraud Logs)]
    end

    subgraph ML[AI and External Data]
        MODEL[Income Loss Prediction Model<br/>Random Forest]
        DATASET[Dataset Generator]
        WEATHER[Weather API]
        AQI[AQI API]
        TRAFFIC[Traffic API]
        DEMAND[Platform Demand Data]
    end

    W --> AUTH
    A --> AUTH
    C --> CLAIMS
    P --> POLICY
    R --> AI

    AUTH --> U
    POLICY --> PO
    PREMIUM --> PO
    TRIGGER --> T
    CLAIMS --> CL
    FRAUD --> FL
    PAYOUT --> PA
    DASH --> U
    DASH --> PO
    DASH --> T
    DASH --> CL
    DASH --> PA
    DASH --> FL

    AI --> MODEL
    AI --> DATASET
    TRIGGER --> WEATHER
    TRIGGER --> AQI
    TRIGGER --> TRAFFIC
    AI --> DEMAND
    PREMIUM --> AI
    TRIGGER --> CLAIMS
    CLAIMS --> FRAUD
    FRAUD --> PAYOUT
```
