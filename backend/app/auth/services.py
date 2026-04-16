from sqlalchemy.orm import Session
from app.auth.models import User
from datetime import datetime, timedelta
from jose import jwt

SECRET_KEY = "mysecretkey"
ALGORITHM = "HS256"


def create_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=60)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def login_user(db: Session, email: str, password: str, selected_role: str):

    user = db.query(User).filter(User.email == email).first()

    if not user:
        return None

    if user.password != password:
        return None

    # Role check: "ADMIN" must match exactly; "FACULTY" = any non-admin role
    if selected_role == "ADMIN" and user.role != "ADMIN":
        return None

    if selected_role == "FACULTY" and user.role == "ADMIN":
        return None

    token_data = {
        "user_id": user.id,
        "role": user.role
    }

    token = create_token(token_data)

    return {
        "access_token": token,
        "token_type": "bearer",
        "role": user.role,
        "name": user.name,
        "email": user.email,
    }