import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

from app.database import SessionLocal, init_db, Case, DCA, SLA
from datetime import datetime, timedelta
import random

def seed_database():
    """Seed the database with sample data"""
    print("Initializing database...")
    init_db()
    
    db = SessionLocal()
    
    try:
        # Clear existing data
        db.query(SLA).delete()
        db.query(Case).delete()
        db.query(DCA).delete()
        db.commit()
        
        print("Seeding DCAs...")
        # Create DCAs
        dcas = [
            DCA(
                name="DCA Alpha",
                performance_score=0.85,
                active_cases=89,
                recovery_rate=78,
                avg_resolution_days=38
            ),
            DCA(
                name="DCA Beta",
                performance_score=0.78,
                active_cases=76,
                recovery_rate=72,
                avg_resolution_days=42
            ),
            DCA(
                name="DCA Gamma",
                performance_score=0.70,
                active_cases=82,
                recovery_rate=65,
                avg_resolution_days=56
            ),
        ]
        
        for dca in dcas:
            db.add(dca)
        db.commit()
        
        print("Seeding cases...")
        # Create sample cases
        customer_names = [
            "Acme Corporation", "TechStart Inc", "Global Logistics", "Retail Solutions",
            "Manufacturing Co", "Digital Services Ltd", "Supply Chain Partners", "Enterprise Systems",
            "Innovation Labs", "Commerce Group", "Logistics Express", "Tech Innovations",
            "Global Trade Co", "Retail Dynamics", "Industrial Solutions", "Smart Systems Inc",
            "Future Tech", "Prime Logistics", "Metro Retail", "Advanced Manufacturing"
        ]
        
        statuses = ["open", "in_progress", "resolved", "closed"]
        priorities = ["High", "Medium", "Low"]
        
        cases = []
        for i in range(100):
            overdue_days = random.randint(5, 150)
            amount = random.randint(5000, 150000)
            
            # Determine priority based on amount and overdue days
            if amount > 50000 or overdue_days > 90:
                priority = "High"
            elif amount > 20000 or overdue_days > 60:
                priority = "Medium"
            else:
                priority = "Low"
            
            # Calculate recovery probability
            recovery_prob = 0.8
            if overdue_days > 90:
                recovery_prob -= 0.3
            elif overdue_days > 60:
                recovery_prob -= 0.15
            
            if amount > 100000:
                recovery_prob -= 0.1
            
            recovery_prob = max(0.1, min(0.95, recovery_prob + random.uniform(-0.1, 0.1)))
            
            case = Case(
                id=f"CASE-{1000 + i}",
                customer_name=random.choice(customer_names),
                amount=amount,
                overdue_days=overdue_days,
                status=random.choice(statuses),
                priority=priority,
                dca_assigned=random.choice([dca.name for dca in dcas]),
                recovery_probability=round(recovery_prob, 2),
                created_at=datetime.utcnow() - timedelta(days=overdue_days)
            )
            cases.append(case)
            db.add(case)
        
        db.commit()
        
        print("Seeding SLAs...")
        # Create SLAs for some cases
        for case in cases[:50]:  # Add SLAs to first 50 cases
            sla_deadline = case.created_at + timedelta(days=90)
            is_breached = case.overdue_days > 90
            
            sla = SLA(
                case_id=case.id,
                sla_deadline=sla_deadline,
                is_breached=is_breached
            )
            db.add(sla)
        
        db.commit()
        
        print(f"\n✓ Database seeded successfully!")
        print(f"  - {len(dcas)} DCAs created")
        print(f"  - {len(cases)} cases created")
        print(f"  - 50 SLAs created")
        
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
