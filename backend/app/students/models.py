from sqlalchemy import Column, Integer, String, Date
from sqlalchemy.orm import declarative_base
from app.core.database import Base#attendance

#attendance remove... Base = declarative_base()

class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(String, unique=True)
    name = Column(String)
    email = Column(String, unique=True)
    phone = Column(String)
    Institude = Column(String)
    course = Column(String)
    admission_date = Column(Date)
    status = Column(String)
    address = Column(String)   # 🔥 detail view ke liye extra