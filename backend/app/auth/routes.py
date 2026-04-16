from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.auth.schemas import LoginRequest, TokenResponse
from app.auth.services import login_user

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/login", response_model=TokenResponse)
def login(data: LoginRequest, db: Session = Depends(get_db)):

    result = login_user(db, data.email, data.password, data.role)

    if not result:
        raise HTTPException(status_code=401, detail="Invalid credentials or role")

    return result