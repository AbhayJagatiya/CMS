from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.core.security import require_role, get_current_user
from app.courses import services, schemas

router = APIRouter(prefix="/courses", tags=["Courses"])

# 🔐 Write access: only Course Manager or Admin can create/update
write_access = Depends(require_role(["COURSE_MANAGER", "ADMIN"]))

# 🔓 Read access: any authenticated user can GET courses (needed for dropdowns)
read_access = Depends(get_current_user)


# ✅ CREATE — write only
@router.post("/", dependencies=[write_access])
def create(data: schemas.CourseCreate, db: Session = Depends(get_db)):
    return services.create_course(db, data)


# ✅ GET ALL — any authenticated role (dropdown usage across all modules)
@router.get("/", dependencies=[read_access])
def get_all(
    search: str = None,
    institute: str = None,
    status: str = None,
    fee: str = None,
    faculty: str = None,
    db: Session = Depends(get_db)
):
    return services.get_courses(db, search, institute, status, fee, faculty)


# ✅ GET ONE — any authenticated role
@router.get("/{course_id}", dependencies=[read_access])
def get_one(course_id: str, db: Session = Depends(get_db)):
    return services.get_course_detail(db, course_id)


# 🔥 UPDATE COURSE — write only
@router.put("/{course_id}", dependencies=[write_access])
def update(course_id: str, data: schemas.CourseUpdate, db: Session = Depends(get_db)):
    result = services.update_course(db, course_id, data)
    if not result:
        raise HTTPException(status_code=404, detail="Course not found")
    return result
