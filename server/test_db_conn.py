import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from database import engine, Base, SessionLocal, UserModel
from routers.auth import hash_password

try:
    Base.metadata.create_all(bind=engine)
    print("SUCCESS: Neon PostgreSQL tables verified/created.")

    db = SessionLocal()
    # Check if test admin exists
    test_user = db.query(UserModel).filter(UserModel.email == "admin@kintsu.org").first()
    if not test_user:
        new_user = UserModel(
            email="admin@kintsu.org",
            password_hash=hash_password("Kintsu2026!"),
            full_name="Priya Rajan",
            role="counselor"
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        print(f"SUCCESS: Created initial user in Neon DB -> Email: {new_user.email} (ID: {new_user.id})")
    else:
        print(f"SUCCESS: Found existing user in Neon DB -> Email: {test_user.email} (ID: {test_user.id})")

    db.close()
    print("SUCCESS: Neon DB Connection & Auth Integration verified!")
except Exception as e:
    print(f"ERROR: {e}")
