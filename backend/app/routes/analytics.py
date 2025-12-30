from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..database import get_db, Case as DBCase, DCA as DBDCA
from datetime import datetime, timedelta

router = APIRouter(prefix="/api/analytics", tags=["analytics"])

@router.get("/ageing-buckets")
def get_ageing_buckets(db: Session = Depends(get_db)):
    """Get distribution of cases by overdue period"""
    buckets = [
        {"label": "0-30 days", "min": 0, "max": 30},
        {"label": "31-60 days", "min": 31, "max": 60},
        {"label": "61-90 days", "min": 61, "max": 90},
        {"label": "90+ days", "min": 91, "max": 999999},
    ]
    
    result = []
    for bucket in buckets:
        cases = db.query(DBCase).filter(
            DBCase.overdue_days >= bucket["min"],
            DBCase.overdue_days <= bucket["max"]
        ).all()
        
        result.append({
            "label": bucket["label"],
            "count": len(cases),
            "amount": sum(c.amount for c in cases)
        })
    
    return result

@router.get("/recovery-rate")
def get_recovery_rate(db: Session = Depends(get_db)):
    """Get recovery rate trends"""
    # Mock data for demo - in production, calculate from actual data
    return [
        {"month": "Jan", "rate": 68},
        {"month": "Feb", "rate": 71},
        {"month": "Mar", "rate": 72},
    ]

@router.get("/dca-performance")
def get_dca_performance(db: Session = Depends(get_db)):
    """Get DCA performance comparison"""
    dcas = db.query(DBDCA).all()
    
    result = []
    for dca in dcas:
        result.append({
            "name": dca.name,
            "cases": dca.active_cases,
            "recoveryRate": dca.recovery_rate,
            "avgDays": dca.avg_resolution_days
        })
    
    return result

@router.get("/sla-breaches")
def get_sla_breaches(db: Session = Depends(get_db)):
    """Get SLA breach summary"""
    total_cases = db.query(DBCase).count()
    
    # Cases overdue > 90 days are considered SLA breaches
    breached_cases = db.query(DBCase).filter(DBCase.overdue_days > 90).count()
    critical_breaches = db.query(DBCase).filter(DBCase.overdue_days > 120).count()
    
    return {
        "total": breached_cases,
        "critical": critical_breaches,
        "percentage": round((breached_cases / total_cases * 100) if total_cases > 0 else 0, 1)
    }

@router.get("/summary")
def get_analytics_summary(db: Session = Depends(get_db)):
    """Get comprehensive analytics summary"""
    total_cases = db.query(DBCase).count()
    total_amount = db.query(func.sum(DBCase.amount)).scalar() or 0
    avg_recovery = db.query(func.avg(DBCase.recovery_probability)).scalar() or 0
    
    # Calculate average resolution days (mock for demo)
    avg_resolution_days = 45
    
    ageing_buckets = get_ageing_buckets(db)
    dca_performance = get_dca_performance(db)
    sla_breaches = get_sla_breaches(db)
    recovery_rate = get_recovery_rate(db)
    
    return {
        "kpis": {
            "totalCases": total_cases,
            "totalAmount": total_amount,
            "avgRecoveryRate": round(avg_recovery * 100, 0),
            "avgResolutionDays": avg_resolution_days
        },
        "ageingBuckets": ageing_buckets,
        "recoveryRate": recovery_rate,
        "dcaPerformance": dca_performance,
        "slaBreaches": sla_breaches
    }
