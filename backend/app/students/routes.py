from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import require_role, get_current_user
from app.students import services, schemas

router = APIRouter(prefix="/students", tags=["Students"])

# 🔐 Write access: only Student Manager or Admin
write_access = Depends(require_role(["STUDENT_MANAGER", "ADMIN"]))

# 🔓 Read access: any authenticated user (needed for attendance roster, fees lookup, etc.)
read_access = Depends(get_current_user)


# ➕ ADD — write only
@router.post("/", dependencies=[write_access])
def create(data: schemas.StudentCreate, db: Session = Depends(get_db)):
    return services.create_student(db, data)


# 📋 GET ALL — any authenticated role (attendance needs student list)
@router.get("/", response_model=list[schemas.StudentListResponse], dependencies=[read_access])
def get_all(
    search: str = None,
    Institude: str = None,
    course: str = None,
    status: str = None,
    db: Session = Depends(get_db)
):
    return services.get_students(db, search, Institude, course, status)


# 👁 GET ONE — any authenticated role
@router.get("/{id}", response_model=schemas.StudentDetailResponse, dependencies=[read_access])
def get_one(id: int, db: Session = Depends(get_db)):
    student = services.get_student(db, id)
    if not student:
        raise HTTPException(404, "Student not found")
    return student


# ✏️ UPDATE — write only
@router.put("/{id}", dependencies=[write_access])
def update(id: int, data: schemas.StudentUpdate, db: Session = Depends(get_db)):
    student = services.update_student(db, id, data)
    if not student:
        raise HTTPException(404, "Student not found")
    return student


# ❌ DELETE — write only
@router.delete("/{id}", dependencies=[write_access])
def delete(id: int, db: Session = Depends(get_db)):
    result = services.delete_student(db, id)
    if not result:
        raise HTTPException(404, "Student not found")
    return {"message": "Deleted"}