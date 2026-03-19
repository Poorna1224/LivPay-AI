# LivPay AI  
Predictive Income Protection System for Gig Workers  

---

## Overview  
LivPay AI is an AI-powered parametric income protection platform designed for gig delivery workers. It protects workers from income loss caused by external disruptions such as heavy rain, extreme heat, pollution, and local restrictions.

Unlike traditional insurance, LivPay AI automatically detects disruptions and triggers instant payouts without requiring manual claims.

---

## Demo Video  
Watch the 2-minute demo here:  
https://youtu.be/qyulRWHtr7U

---

## Problem Statement  
Gig workers rely on daily earnings and face income instability due to unpredictable external disruptions.

Key challenges include:
- Sudden income loss due to weather and environmental conditions  
- Lack of accessible income protection systems  
- Difficulty in verifying claims at scale  
- Risk of fraud in automated systems  

---

## Target Persona  

Example: Delivery Partner  
- Platform: Swiggy / Zomato  
- Daily Earnings: ₹600–₹800  
- Work Type: On-demand delivery  

These workers face income loss during disruptions such as rain, pollution, or curfews.

---

## Workflow  

1. Worker registers on the platform  
2. System collects location and earnings data  
3. AI builds a risk profile  
4. Weekly premium is assigned  
5. System monitors real-time environmental data  
6. Parametric trigger detects disruption  
7. Income loss is calculated  
8. Instant payout is processed  

---

## Weekly Premium Model  

| Risk Level | Weekly Premium | Coverage |
|------------|----------------|----------|
| Low        | ₹20            | Basic protection |
| Medium     | ₹30            | Moderate protection |
| High       | ₹40            | High protection |

Premiums are dynamically adjusted based on risk and worker activity.

---

## Parametric Triggers  

| Event       | Trigger Condition        |
|------------|--------------------------|
| Heavy Rain | Rainfall exceeds threshold |
| Heatwave   | Temperature above 42°C    |
| Pollution  | AQI above 300             |
| Curfew     | Government restrictions   |

Payouts are triggered automatically without manual claims.

---

## AI/ML Integration  

Risk Prediction  
- Predicts disruption probability  
- Helps determine weekly premium  

Fraud Detection  
- Identifies suspicious claims  
- Detects abnormal behavior  

Anomaly Detection  
- Flags unusual activity patterns  
- Prevents misuse  

Predictive Alerts  
- Notifies users of upcoming disruptions  

---

## Adversarial Defense and Anti-Spoofing Strategy  

Differentiation  
- Uses behavioral patterns and delivery history  
- Compares environmental data with user activity  

Data Beyond GPS  
- Delivery activity patterns  
- Time consistency  
- Device-level signals  
- Environmental matching  

Fraud Ring Detection  
- Graph-based detection of coordinated fraud  
- Identifies clusters with similar behavior  

User Experience Balance  
- Suspicious claims are flagged for review  
- Genuine users are not penalized immediately  

---

## System Architecture  

User Application → Data Collection → AI Risk Engine →  
Environmental Monitoring → Trigger Engine →  
Fraud Detection → Payout Engine → Dashboard  

---

## Technology Stack  

Frontend  
- React or Flutter  

Backend  
- Node.js or FastAPI  

Database  
- PostgreSQL  

AI/ML  
- Python  
- Scikit-learn  

APIs  
- Weather APIs  
- AQI APIs  
- Location Services  

---

## Development Plan  

Phase 1  
- Research and system design  
- Architecture planning  

Phase 2  
- Core system development  
- Onboarding and trigger system  

Phase 3  
- Fraud detection implementation  
- Dashboard and optimization  

---

## Expected Impact  

- Provides financial stability for gig workers  
- Enables automated and instant payouts  
- Reduces fraud risks  
- Scales across different cities  

---

## Future Scope  

- Integration with delivery platforms  
- Advanced AI-based risk modeling  
- Real-time predictive alerts  
- Expansion to larger regions  


## Team  

Team Name: TheResolvers  

| Name                | Role         |
|---------------------|--------------|
| R.Poorna Chandra    | Team Leader  |
| T.Kavya    	      | Member       |
| A.Sahasra           | Member       |
| K.Sai Harshini      | Member       |
| K.Lakshmi Chersihma | Member       |

  

LivPay AI transforms traditional insurance into a predictive and automated income protection system that ensures financial stability for gig workers during external disruptions.
