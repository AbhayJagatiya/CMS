from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import declarative_base
from app.core.database import Base

class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(String, ForeignKey("students.student_id"))
    date = Column(Date)
    status = Column(String)  # PRESENT / ABSENT