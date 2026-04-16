from pydantic import BaseModel
from datetime import date


class AttendanceBase(BaseModel):
    student_id: str
    date: date
    status: str


class AttendanceToggle(BaseModel):
    student_id: str
    date: date


# 🔥 LIST VIEW
class AttendanceResponse(BaseModel):
    student_id: str
    name: str
    phone: str
    date: date
    status: str

    class Config:
        from_attributes = True


# 🔥 CALENDAR VIEW
class AttendanceCalendarResponse(BaseModel):
    date: date
    status: str

    class Config:
        from_attributes = True

class AttendanceListResponse(BaseModel):
    student_id: str
    name: str
    phone: str
    institute: str
    course: str
    status: str
    date: date

    class Config:
        from_attributes = True