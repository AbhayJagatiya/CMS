from sqlalchemy.orm import Session
from datetime import date
from sqlalchemy import or_, case
from app.students.models import Student
from app.attendance.models import Attendance


# 🔥 MAIN: GET attendance by date
def get_attendance_by_date(
    db,
    selected_date=None,
    search=None,
    institute=None,
    course=None
):

    # ✅ default today
    if not selected_date:
        selected_date = date.today()

    # Optimized Query with JOIN
    # We outer join Student with Attendance for the specific date
    query = db.query(
        Student.student_id,
        Student.name,
        Student.phone,
        Student.Institude.label("institute"),
        Student.course,
        case((Attendance.status == None, "ABSENT"), else_=Attendance.status).label("status")
    ).outerjoin(
        Attendance, 
        (Student.student_id == Attendance.student_id) & (Attendance.date == selected_date)
    )

    # 🔍 SEARCH
    if search:
        query = query.filter(
            or_(
                Student.name.ilike(f"%{search}%"),
                Student.email.ilike(f"%{search}%"),
                Student.student_id.ilike(f"%{search}%")
            )
        )

    # 🎯 FILTERS
    if institute:
        query = query.filter(Student.Institude.ilike(f"%{institute}%"))
    if course:
        query = query.filter(Student.course.in_(course))

    students_attendance = query.all()

    # Map to schema-friendly dict
    result = []
    for row in students_attendance:
        result.append({
            "student_id": row.student_id,
            "name": row.name,
            "phone": row.phone,
            "institute": row.institute,
            "course": row.course,
            "status": row.status,
            "date": selected_date
        })

    return result

# 🔥 TOGGLE attendance
def toggle_attendance(db: Session, student_id: str, selected_date: date):

    record = db.query(Attendance).filter(
        Attendance.student_id == student_id,
        Attendance.date == selected_date
    ).first()

    if record:
        # toggle
        record.status = "PRESENT" if record.status == "ABSENT" else "ABSENT"
    else:
        # create new (first time click)
        record = Attendance(
            student_id=student_id,
            date=selected_date,
            status="PRESENT"
        )
        db.add(record)

    db.commit()
    db.refresh(record)

    return record


# 🔥 CALENDAR (student detail)
def get_student_attendance(db: Session, student_id: str):

    records = db.query(Attendance).filter(
        Attendance.student_id == student_id
    ).all()

    return records