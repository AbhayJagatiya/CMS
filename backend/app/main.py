from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.auth.routes import router as auth_router
from app.admin.routes import router as admin_router
from app.students.routes import router as student_router
from app.attendance.routes import router as attendance_router
from app.courses.routes import router as course_router

# 🔥 IMPORTANT
from app.core.database import create_tables

# 🔥 models import (VERY IMPORTANT)
from app.students import models as student_models
from app.attendance import models as attendance_models
from app.courses import models as course_models

from app.fees.routes import router as fees_router
from app.admin.faculty_routes import router as faculty_router
from app.analytics.routes import router as analytics_router

app = FastAPI()

# 🌐 CORS — allow React dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the College Management System"}

# 🔥 create tables
create_tables()

# 🔗 routers
app.include_router(auth_router)
app.include_router(admin_router)
app.include_router(student_router)
app.include_router(attendance_router)
app.include_router(course_router)
app.include_router(fees_router)
app.include_router(faculty_router)
app.include_router(analytics_router)