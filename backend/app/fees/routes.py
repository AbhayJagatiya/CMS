from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.fees import services, schemas
from app.core.security import require_role

router = APIRouter(prefix="/fees", tags=["Fees"])

# 🔐 ONLY FEES MANAGER
role_access = Depends(require_role(["FEES_MANAGER", "ADMIN"]))


# 🔥 GET ALL
@router.get("/", dependencies=[role_access])
def get_all(
    search: str = None,
    institute: str = None,
    course: str = None,
    status: str = None,
    db: Session = Depends(get_db)
):
    return services.get_all(db, search, institute, course, status)


# 🔥 PAYMENT
@router.post("/pay", dependencies=[role_access])
def pay(data: schemas.PaymentCreate, db: Session = Depends(get_db)):

    result = services.make_payment(db, data)

    if not result:
        raise HTTPException(404, "Fee record not found")

    return result


# 🔥 DUE DATE
@router.post("/due-date", dependencies=[role_access])
def due(data: schemas.DueDateCreate, db: Session = Depends(get_db)):
    return services.set_due_date(db, data)   # ✅ FIX

# 🔥 DETAIL VIEW
@router.get("/{student_id}", dependencies=[role_access])
def detail(student_id: str, db: Session = Depends(get_db)):
    return services.get_fee_detail(db, student_id)