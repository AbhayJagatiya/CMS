# from sqlalchemy import Column, Integer, String
# from app.core.database import Base


# class Faculty(Base):
#     __tablename__ = "faculties"

#     id = Column(Integer, primary_key=True, index=True)

#     name = Column(String)
#     email = Column(String, unique=True, index=True)
#     phone = Column(String)

#     employee_id = Column(String, unique=True)

#     role = Column(String)  # STUDENT / ATTENDANCE / FEES / COURSE

#     password = Column(String)