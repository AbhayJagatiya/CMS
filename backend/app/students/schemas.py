from pydantic import BaseModel
from datetime import date

class StudentBase(BaseModel):
    student_id: str
    name: str
    email: str
    phone: str
    Institude: str 
    course: str
    admission_date: date
    status: str
    address: str

class StudentCreate(StudentBase):
    pass

class StudentUpdate(StudentBase):
    pass

# 🔹 FULL RESPONSE (use for create/update अगर चाहिए)
class StudentResponse(StudentBase):
    id: int
    student_id: str

    class Config:
        from_attributes = True


# 🔥 NEW → LIST VIEW (NO ADDRESS)
class StudentListResponse(BaseModel):
    id: int
    student_id: str
    name: str
    email: str
    phone: str
    Institude: str
    course: str
    admission_date: date
    status: str

    class Config:
        from_attributes = True


# 🔥 NEW → DETAIL VIEW (WITH ADDRESS)
class StudentDetailResponse(BaseModel):
    id: int
    student_id: str
    name: str
    email: str
    phone: str
    Institude: str
    course: str
    admission_date: date
    status: str
    address: str   # 👈 only here

    class Config:
        from_attributes = True