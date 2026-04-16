from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from datetime import date
from fastapi import Query

from app.core.database import get_db
from app.core.security import require_role

# from app.students import schemas
from app.students import schemas as student_schemas
from app.attendance import schemas as attendance_schemas

from app.admin import services

router = APIRouter(prefix="/admin", tags=["Admin"])

role_access = Depends(require_role(["ADMIN"]))

@router.get("/students", response_model=list[student_schemas.StudentListResponse], dependencies=[role_access])
def get_students(
    search: str = None,
    Institude: str = None,
    course: str = None,
    status: str = None,
    db: Session = Depends(get_db)
):
    return services.get_students(db, search, Institude, course, status)


@router.get("/students/{id}", response_model=student_schemas.StudentDetailResponse, dependencies=[role_access])
def get_student(id: int, db: Session = Depends(get_db)):
    return services.get_student(db, id)

@router.get("/attendance", response_model=List[attendance_schemas.AttendanceListResponse], dependencies=[role_access])
def get_attendance(
    selected_date: date = None,
    search: str = None,
    institute: str = None,
    course: List[str] = Query(None),
    db: Session = Depends(get_db)
):
    return services.get_attendance(
        db, selected_date, search, institute, course
    )


@router.get("/attendance/student/{student_id}", dependencies=[role_access])
def student_attendance(student_id: str, db: Session = Depends(get_db)):
    return services.get_student_attendance(db, student_id)

@router.get("/courses", dependencies=[role_access])
def get_courses(
    search: str = None,
    institute: str = None,
    status: str = None,
    fee: str = None,
    faculty: str = None,
    db: Session = Depends(get_db)
):
    return services.get_courses(db, search, institute, status, fee, faculty)


@router.get("/courses/{course_id}", dependencies=[role_access])
def get_course(course_id: str, db: Session = Depends(get_db)):
    return services.get_course_detail(db, course_id)

@router.get("/fees", dependencies=[role_access])
def get_fees(
    search: str = None,
    institute: str = None,
    course: str = None,
    status: str = None,
    db: Session = Depends(get_db)
):
    return services.get_fees(db, search, institute, course, status)


@router.get("/fees/{student_id}", dependencies=[role_access])
def get_fee_detail(student_id: str, db: Session = Depends(get_db)):
    return services.get_fee_detail(db, student_id)