from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import date

from app.core.database import get_db
from app.core.security import require_role
from typing import List
from fastapi import Query
from app.attendance import services, schemas

router = APIRouter(prefix="/attendance", tags=["Attendance"])

# 🔐 RBAC
role_access = Depends(require_role(["ATTENDANCE_MANAGER", "ADMIN"]))

# 🔥 GET by date
@router.get("/", response_model=List[schemas.AttendanceListResponse], dependencies=[role_access])
def get_attendance(
    selected_date: date = None,
    search: str = None,
    institute: str = None,
    course: List[str] = Query(None),
    db: Session = Depends(get_db)
):
    return services.get_attendance_by_date(
        db,
        selected_date,
        search,
        institute,
        course
    )

# 🔥 TOGGLE
@router.post("/toggle", dependencies=[role_access])
def toggle(data: schemas.AttendanceToggle, db: Session = Depends(get_db)):
    return services.toggle_attendance(db, data.student_id, data.date)


# 🔥 CALENDAR
@router.get("/student/{student_id}", dependencies=[role_access])
def student_attendance(student_id: str, db: Session = Depends(get_db)):
    return services.get_student_attendance(db, student_id)