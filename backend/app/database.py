from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Boolean, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime

SQLALCHEMY_DATABASE_URL = "sqlite:///./fedex_dca.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class Case(Base):
    __tablename__ = "cases"

    id = Column(String, primary_key=True, index=True)
    customer_name = Column(String, index=True)
    amount = Column(Float)
    overdue_days = Column(Integer)
    status = Column(String)  # open, in_progress, resolved, closed
    priority = Column(String)  # High, Medium, Low
    dca_assigned = Column(String, ForeignKey("dcas.name"))
    recovery_probability = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    sla = relationship("SLA", back_populates="case", uselist=False)

class DCA(Base):
    __tablename__ = "dcas"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    performance_score = Column(Float)
    active_cases = Column(Integer)
    recovery_rate = Column(Float)
    avg_resolution_days = Column(Integer)

class SLA(Base):
    __tablename__ = "slas"

    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(String, ForeignKey("cases.id"))
    sla_deadline = Column(DateTime)
    is_breached = Column(Boolean, default=False)
    
    # Relationships
    # Relationships
    case = relationship("Case", back_populates="sla")

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    full_name = Column(String)
    hashed_password = Column(String)
    role = Column(String, default="agent") # agent, manager, admin
    created_at = Column(DateTime, default=datetime.utcnow)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    Base.metadata.create_all(bind=engine)
