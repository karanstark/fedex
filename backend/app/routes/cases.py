from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db, Case as DBCase
from ..models import CaseResponse, CaseCreate, CaseUpdate
import random
import string

router = APIRouter(prefix="/api/cases", tags=["cases"])

def generate_case_id():
    return f"CASE-{random.randint(1000, 9999)}"

@router.get("/", response_model=List[CaseResponse])
def get_cases(
    skip: int = 0,
    limit: int = 100,
    priority: str = None,
    status: str = None,
    db: Session = Depends(get_db)
):
    """Get all cases with optional filters"""
    query = db.query(DBCase)
    
    if priority:
        query = query.filter(DBCase.priority == priority)
    if status:
        query = query.filter(DBCase.status == status)
    
    cases = query.offset(skip).limit(limit).all()
    return cases

@router.get("/{case_id}", response_model=CaseResponse)
def get_case(case_id: str, db: Session = Depends(get_db)):
    """Get a specific case by ID"""
    case = db.query(DBCase).filter(DBCase.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    return case

@router.post("/", response_model=CaseResponse)
def create_case(case: CaseCreate, db: Session = Depends(get_db)):
    """Create a new case"""
    db_case = DBCase(
        id=generate_case_id(),
        **case.dict()
    )
    db.add(db_case)
    db.commit()
    db.refresh(db_case)
    return db_case

@router.put("/{case_id}", response_model=CaseResponse)
def update_case(case_id: str, case_update: CaseUpdate, db: Session = Depends(get_db)):
    """Update a case"""
    db_case = db.query(DBCase).filter(DBCase.id == case_id).first()
    if not db_case:
        raise HTTPException(status_code=404, detail="Case not found")
    
    update_data = case_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_case, field, value)
    
    db.commit()
    db.refresh(db_case)
    return db_case

@router.post("/{case_id}/allocate")
def allocate_case(case_id: str, dca_name: str, db: Session = Depends(get_db)):
    """Allocate a case to a DCA"""
    db_case = db.query(DBCase).filter(DBCase.id == case_id).first()
    if not db_case:
        raise HTTPException(status_code=404, detail="Case not found")
    
    db_case.dca_assigned = dca_name
    db_case.status = "in_progress"
    db.commit()
    
    return {"message": f"Case {case_id} allocated to {dca_name}"}
