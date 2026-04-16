from pydantic import BaseModel
from datetime import date
from typing import Optional


# 🔹 PAYMENT REQUEST
class PaymentCreate(BaseModel):
    student_id: str
    semester: Optional[str] = None
    amount: int
    method: str


# 🔹 DUE DATE
class DueDateCreate(BaseModel):
    course: str
    due_date: date

# 🔹 RESPONSE (TABLE VIEW)
class FeeResponse(BaseModel):
    student_id: str
    name: str
    course: str
    total_fees: int
    paid_amount: int
    pending_amount: int
    due_date: Optional[date]
    status: str

    class Config:
        from_attributes = True