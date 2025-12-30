from sqlalchemy.orm import Session
from app.database import SessionLocal, engine, Base
from app.routes.auth import get_password_hash
from app.database import User

def seed_users():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    # Check if user exists
    user = db.query(User).filter(User.email == "abc@gmail.com").first()
    if not user:
        print("Creating user abc@gmail.com...")
        new_user = User(
            email="abc@gmail.com",
            full_name="Admin User",
            hashed_password=get_password_hash("12345678"),
            role="admin"
        )
        db.add(new_user)
        db.commit()
        print("User created successfully.")
    else:
        print("User abc@gmail.com already exists.")
    
    db.close()

if __name__ == "__main__":
    seed_users()
