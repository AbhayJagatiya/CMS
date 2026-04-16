from sqlalchemy.orm import Session
from sqlalchemy import func, case, extract
from app.students.models import Student
from app.attendance.models import Attendance
from app.courses.models import Course
from app.fees.models import Fee, Payment
from datetime import date, timedelta
from typing import List

def get_dashboard_analytics(db: Session):
    # 1. Stats
    total_students = db.query(func.count(Student.id)).scalar() or 0
    total_courses = db.query(func.count(Course.id)).scalar() or 0
    active_courses_count = db.query(func.count(Course.id)).filter(Course.status == "Active").count()
    
    # Attendance % logic (centralized)
    attendance_stats = db.query(
        func.count(Attendance.id).label("total"),
        func.count(case((Attendance.status == "PRESENT", 1))).label("present")
    ).first()
    
    attendance_pct = 0
    if attendance_stats and attendance_stats.total > 0:
        attendance_pct = round((attendance_stats.present / attendance_stats.total) * 100)
    
    # Fees logic
    total_fees_collected = db.query(func.sum(Fee.paid_amount)).scalar() or 0
    
    # Helper for fee formatting (mirrors frontend)
    def format_fees(val):
        if val >= 10000000: return f"₹{(val / 10000000):.1f}Cr"
        if val >= 100000: return f"₹{(val / 100000):.1f}L"
        if val >= 1000: return f"₹{(val / 1000):.1f}K"
        return f"₹{val}"

    stats = {
        "students": f"{total_students:,}",
        "attendance": f"{attendance_pct}%",
        "courses": str(total_courses),
        "activeCourses": f"{active_courses_count} Active",
        "fees": format_fees(total_fees_collected)
    }

    # 2. Attendance Trends (Last 12 months)
    # We'll generate a consistent set of month labels
    # For now, let's keep it simple and get real data from DB
    attendance_trends_raw = db.query(
        extract('month', Attendance.date).label('month'),
        extract('year', Attendance.date).label('year'),
        func.count(Attendance.id).label('total'),
        func.count(case((Attendance.status == "PRESENT", 1))).label('present')
    ).group_by('year', 'month').order_by('year', 'month').all()

    month_names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    attendance_trends = []
    for row in attendance_trends_raw:
        month_label = f"{month_names[int(row.month)-1]} {str(row.year)[2:]}"
        val = round((row.present / row.total) * 100) if row.total > 0 else 0
        attendance_trends.append({"name": month_label, "value": val})

    # 3. Fee Trends (Actual vs Projected)
    fee_trends_raw = db.query(
        extract('month', Payment.date).label('month'),
        extract('year', Payment.date).label('year'),
        func.sum(Payment.amount).label('actual')
    ).group_by('year', 'month').order_by('year', 'month').all()

    fee_trends = []
    for row in fee_trends_raw:
        month_label = f"{month_names[int(row.month)-1]} {str(row.year)[2:]}"
        actual = float(row.actual or 0)
        # Projected is actual + some growth margin for UI display
        projected = round(actual * 1.15) 
        fee_trends.append({"name": month_label, "actual": actual, "projected": projected})

    # 4. Top Performers (By Attendance %)
    # JOIN Student on Attendance
    top_performers_raw = db.query(
        Student.name,
        Student.course,
        func.count(Attendance.id).label('total'),
        func.count(case((Attendance.status == "PRESENT", 1))).label('present')
    ).join(Attendance, Student.student_id == Attendance.student_id)\
     .group_by(Student.id, Student.name, Student.course)\
     .having(func.count(Attendance.id) >= 3)\
     .all()

    top_performers = []
    for row in top_performers_raw:
        pct = round((row.present / row.total) * 100) if row.total > 0 else 0
        top_performers.append({"name": row.name, "course": row.course, "percentage": pct})
    
    top_performers = sorted(top_performers, key=lambda x: x['percentage'], reverse=True)[:5]

    # 5. Enrollment by Course (Dynamic from DB)
    enrollment_raw = db.query(
        Student.course,
        func.count(Student.id).label('count')
    ).group_by(Student.course).all()

    # Predefined colors for the chart
    chart_colors = ['#4F46E5', '#7C3AED', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#8B5CF6']
    enrollment_by_course = []
    for i, row in enumerate(enrollment_raw):
        if not row.course: continue # Skip empty courses
        enrollment_by_course.append({
            "name": row.course,
            "value": row.count,
            "color": chart_colors[i % len(chart_colors)]
        })

    # 6. Recent Attendance (Last 10 records with JOINs)
    recent_attendance_raw = db.query(
        Attendance.student_id,
        Student.name,
        Student.course,
        Attendance.status,
        Attendance.date
    ).join(Student, Attendance.student_id == Student.student_id)\
     .order_by(Attendance.date.desc(), Attendance.id.desc())\
     .limit(10).all()

    recent_attendance = []
    for row in recent_attendance_raw:
        recent_attendance.append({
            "student_id": row.student_id,
            "name": row.name,
            "course": row.course,
            "status": row.status,
            "date": row.date
        })

    return {
        "stats": stats,
        "attendanceTrends": attendance_trends,
        "feeTrends": fee_trends,
        "topPerformers": top_performers,
        "enrollmentByCourse": enrollment_by_course,
        "recentAttendance": recent_attendance
    }
