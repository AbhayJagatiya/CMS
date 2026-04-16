from sqlalchemy import Column, Integer, String, Date
from app.core.database import Base


class Fee(Base):
    __tablename__ = "fees"

    id = Column(Integer, primary_key=True, index=True)

    student_id = Column(String, index=True)
    course = Column(String)

    total_fees = Column(Integer)
    paid_amount = Column(Integer, default=0)
    pending_amount = Column(Integer)
    credit_balance = Column(Integer, default=0)


    due_date = Column(Date, nullable=True)
    status = Column(String, default="Pending")


class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)

    student_id = Column(String)
    semester = Column(String)

    amount = Column(Integer)
    method = Column(String)

    date = Column(Date)
    status = Column(String)


class CourseDueDate(Base):
    __tablename__ = "course_due_dates"

    id = Column(Integer, primary_key=True, index=True)
    course = Column(String)
    due_date = Column(Date)