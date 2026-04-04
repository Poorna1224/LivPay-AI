# LivPay AI Database Schema

## Diagram Prompt

```text
Create a database schema diagram for a parametric insurance platform.

Tables:

Users:
id, name, phone, city, zone, platform, weekly_income, payout_method

Policies:
id, user_id, premium_amount, coverage_amount, risk_level, status

Triggers:
id, user_id, trigger_type, trigger_value, zone, status, created_at

Claims:
id, user_id, trigger_id, claim_amount, status, created_at

Payouts:
id, claim_id, amount, payout_method, status, created_at

FraudLogs:
id, user_id, claim_id, fraud_score, fraud_status, reason, created_at

Relationships:
User -> Policies (1 to many)
User -> Triggers (1 to many)
User -> Claims (1 to many)
Claims -> Payouts (1 to 1)
Claims -> FraudLogs (1 to 1)
Triggers -> Claims (1 to many)

Create ER diagram style database schema.
```

## Mermaid ER Diagram

```mermaid
erDiagram
    USERS ||--o{ POLICIES : has
    USERS ||--o{ TRIGGERS : receives
    USERS ||--o{ CLAIMS : creates
    TRIGGERS ||--o{ CLAIMS : generates
    CLAIMS ||--|| PAYOUTS : pays_out
    CLAIMS ||--|| FRAUD_LOGS : checked_by
    USERS ||--o{ FRAUD_LOGS : flagged_for

    USERS {
        int id
        string name
        string phone
        string city
        string zone
        string platform
        float weekly_income
        string payout_method
    }

    POLICIES {
        int id
        int user_id
        float premium_amount
        float coverage_amount
        string risk_level
        string status
    }

    TRIGGERS {
        int id
        int user_id
        string trigger_type
        float trigger_value
        string zone
        string status
        datetime created_at
    }

    CLAIMS {
        int id
        int user_id
        int trigger_id
        float claim_amount
        string status
        datetime created_at
    }

    PAYOUTS {
        int id
        int claim_id
        float amount
        string payout_method
        string status
        datetime created_at
    }

    FRAUD_LOGS {
        int id
        int user_id
        int claim_id
        float fraud_score
        string fraud_status
        string reason
        datetime created_at
    }
```
