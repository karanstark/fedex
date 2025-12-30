from fastapi import APIRouter, HTTPException
from ..models import PredictionRequest, PredictionResponse
import os
import joblib
import numpy as np

router = APIRouter(prefix="/api/predict", tags=["predictions"])

# Load ML models (will be created later)
MODEL_DIR = os.path.join(os.path.dirname(__file__), "../../ml/models")

def load_models():
    """Load trained ML models"""
    try:
        priority_model = joblib.load(os.path.join(MODEL_DIR, "priority_model.pkl"))
        recovery_model = joblib.load(os.path.join(MODEL_DIR, "recovery_model.pkl"))
        return priority_model, recovery_model
    except:
        return None, None

@router.post("/priority", response_model=PredictionResponse)
def predict_priority(request: PredictionRequest):
    """Predict case priority using ML model"""
    priority_model, _ = load_models()
    
    if priority_model is None:
        # Fallback to rule-based prediction
        if request.amount > 50000 or request.overdue_days > 90:
            priority = "High"
            confidence = 0.85
        elif request.amount > 20000 or request.overdue_days > 60:
            priority = "Medium"
            confidence = 0.75
        else:
            priority = "Low"
            confidence = 0.70
    else:
        # Use ML model
        features = np.array([[
            request.amount,
            request.overdue_days,
            1 if request.customer_segment == "premium" else 0,
            request.previous_defaults
        ]])
        priority = priority_model.predict(features)[0]
        confidence = max(priority_model.predict_proba(features)[0])
    
    return PredictionResponse(
        priority=priority,
        confidence=round(confidence, 2)
    )

@router.post("/recovery", response_model=PredictionResponse)
def predict_recovery(request: PredictionRequest):
    """Predict recovery probability using ML model"""
    _, recovery_model = load_models()
    
    if recovery_model is None:
        # Fallback to rule-based prediction
        base_prob = 0.8
        
        # Adjust based on overdue days
        if request.overdue_days > 90:
            base_prob -= 0.3
        elif request.overdue_days > 60:
            base_prob -= 0.15
        
        # Adjust based on amount
        if request.amount > 100000:
            base_prob -= 0.1
        
        recovery_probability = max(0.1, min(0.95, base_prob))
        confidence = 0.70
    else:
        # Use ML model
        features = np.array([[
            request.amount,
            request.overdue_days,
            1 if request.customer_segment == "premium" else 0,
            request.previous_defaults
        ]])
        recovery_probability = recovery_model.predict(features)[0]
        confidence = 0.85
    
    return PredictionResponse(
        recovery_probability=round(recovery_probability, 2),
        confidence=round(confidence, 2)
    )

@router.post("/full")
def predict_full(request: PredictionRequest):
    """Get both priority and recovery predictions"""
    priority_result = predict_priority(request)
    recovery_result = predict_recovery(request)
    
    return {
        "priority": priority_result.priority,
        "recovery_probability": recovery_result.recovery_probability,
        "priority_confidence": priority_result.confidence,
        "recovery_confidence": recovery_result.confidence
    }
