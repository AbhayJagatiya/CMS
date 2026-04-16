from sqlalchemy import Column, Integer, String
from app.core.database import Base


class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(String, unique=True, index=True)
    institute = Column(String)
    course_name = Column(String)
    total_fee = Column(Integer)
    duration = Column(String)
    faculty = Column(String)
    status = Column(String)  # ACTIVE / INACTIVE