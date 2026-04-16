from pydantic import BaseModel


# 🔹 CREATE
class FacultyCreate(BaseModel):
    name: str
    email: str
    phone: str
    employee_id: str
    role: str
    password: str


# 🔹 RESPONSE
class FacultyResponse(BaseModel):
    id: int
    name: str
    email: str
    phone: str
    employee_id: str
    role: str

    class Config:
        from_attributes = True


# 🔹 PASSWORD RESET
class PasswordReset(BaseModel):
    faculty_id: int
    new_password: str