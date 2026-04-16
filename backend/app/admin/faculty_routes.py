from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import require_role

from app.admin import faculty_schemas, faculty_services

router = APIRouter(prefix="/faculty", tags=["Faculty"])

role_access = Depends(require_role(["ADMIN"]))

@router.post("/", dependencies=[role_access])
def create(data: faculty_schemas.FacultyCreate, db: Session = Depends(get_db)):
    return faculty_services.create_faculty(db, data)

@router.get("/", dependencies=[role_access])
def get_all(db: Session = Depends(get_db)):
    return faculty_services.get_all_faculty(db)

@router.post("/reset-password", dependencies=[role_access])
def reset(data: faculty_schemas.PasswordReset, db: Session = Depends(get_db)):

    result = faculty_services.reset_password(db, data)

    if not result:
        raise HTTPException(404, "Faculty not found")

    return result

