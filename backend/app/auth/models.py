from sqlalchemy import Column, Integer, String
from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String)
    email = Column(String, unique=True, index=True)
    phone = Column(String)

    employee_id = Column(String, unique=True, nullable=True)

    password = Column(String)

    role = Column(String)  
    # ADMIN / STUDENT / ATTENDANCE / FEES / COURSE