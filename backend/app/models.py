from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class CaseBase(BaseModel):
    customer_name: str
    amount: float
    overdue_days: int
    status: str
    priority: str
    dca_assigned: Optional[str] = None
    recovery_probability: Optional[float] = None

class CaseCreate(CaseBase):
    pass

class CaseUpdate(BaseModel):
    status: Optional[str] = None
    dca_assigned: Optional[str] = None
    priority: Optional[str] = None

class CaseResponse(CaseBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class DCABase(BaseModel):
    name: str
    performance_score: float
    active_cases: int
    recovery_rate: float
    avg_resolution_days: int

class DCAResponse(DCABase):
    id: int

    class Config:
        from_attributes = True

class PredictionRequest(BaseModel):
    amount: float
    overdue_days: int
    customer_segment: Optional[str] = "standard"
    previous_defaults: Optional[int] = 0

class PredictionResponse(BaseModel):
    priority: Optional[str] = None
    recovery_probability: Optional[float] = None
    confidence: float

# User Schemas
class UserBase(BaseModel):
    email: str
    full_name: Optional[str] = None
    role: Optional[str] = "agent"

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
