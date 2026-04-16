from sqlalchemy.orm import Session
from datetime import date

from app.students.models import Student
from app.courses.models import Course
from app.fees.models import CourseDueDate, Fee, Payment

from fastapi import HTTPException

# 🔥 GET ALL FEES (TABLE)
def get_all(db: Session, search=None, institute=None, course=None, status=None):

    students = db.query(Student).all()
    result = []

    for student in students:

        # 🔍 SEARCH
        if search and search.lower() not in student.name.lower():
            continue

        # 🎯 FILTER institute
        if institute and institute.lower() != student.Institude.lower():
            continue

        # 🎯 FILTER course
        if course and course.lower() != student.course.lower():
            continue

        # 📦 COURSE → TOTAL FEES
        course_data = db.query(Course).filter(
            Course.course_name == student.course
        ).first()

        total_fee = course_data.total_fee if course_data else 0

        # 📦 FEE RECORD
        fee = db.query(Fee).filter(Fee.student_id == student.student_id).first()

        # 🔥 अगर fee record नहीं है तो create करो
        if not fee:
            fee = Fee(
                student_id=student.student_id,
                course=student.course,
                total_fees=total_fee,
                paid_amount=0,
                pending_amount=total_fee,
                status="Pending"
            )
            db.add(fee)
            db.commit()
            db.refresh(fee)

        # 🛡️ DYNAMIC CALCULATION
        payments = db.query(Payment).filter(Payment.student_id == student.student_id).all()
        paid = sum(p.amount for p in payments)
        pending = max(0, total_fee - paid)
        credit = max(0, paid - total_fee)

        # Sync the fee record for consistency
        fee.total_fees = total_fee
        fee.paid_amount = paid
        fee.pending_amount = pending
        fee.credit_balance = credit
        fee.status = "Paid" if pending <= 0 else "Pending"
        db.commit()


        status_val = "Paid" if pending <= 0 else "Pending"

        # 🎯 FILTER status
        if status and status.lower() != status_val.lower():
            continue

        # 🔥 DUE DATE (course wise from CourseDueDate table)
        due = db.query(CourseDueDate).filter(
            CourseDueDate.course == student.course
        ).first()

        result.append({
            "student_id": student.student_id,
            "name": student.name,
            "course": student.course,
            "total_fees": total_fee,
            "paid_amount": paid,
            "pending_amount": pending,
            "credit_balance": credit,
            "due_date": due.due_date if due else None,
            "status": status_val
        })


    return result


# 🔥 PAYMENT
def make_payment(db: Session, data):

    fee = db.query(Fee).filter(Fee.student_id == data.student_id).first()

    if not fee:
        return None

    # 🛡️ DYNAMIC OVERPAYMENT VALIDATION (ALLOWED)
    student = db.query(Student).filter(Student.student_id == data.student_id).first()
    course_data = db.query(Course).filter(Course.course_name == student.course).first()
    current_total = course_data.total_fee if course_data else fee.total_fees

    # Calculate BEFORE this new payment
    payments = db.query(Payment).filter(Payment.student_id == data.student_id).all()
    total_paid_before = sum(p.amount for p in payments)
    
    # Calculate AFTER this new payment
    new_total_paid = total_paid_before + data.amount
    
    remaining = max(0, current_total - new_total_paid)
    credit = max(0, new_total_paid - current_total)

    # Note: ALWAYS recompute and sync record
    fee.total_fees = current_total
    fee.paid_amount = new_total_paid
    fee.pending_amount = remaining
    fee.credit_balance = credit
    fee.status = "Paid" if remaining <= 0 else "Pending"



    payment = Payment(
        student_id=data.student_id,
        semester=data.semester or "TOTAL",
        amount=data.amount,
        method=data.method,
        date=date.today(),
        status="Success"
    )

    db.add(payment)
    db.commit()
    db.refresh(fee)

    return fee



# 🔥 DUE DATE UPDATE (COURSE BASED)
def set_due_date(db: Session, data):

    existing = db.query(CourseDueDate).filter(
        CourseDueDate.course == data.course
    ).first()

    if existing:
        existing.due_date = data.due_date
    else:
        new = CourseDueDate(
            course=data.course,
            due_date=data.due_date
        )
        db.add(new)

    db.commit()

    return {"msg": "Due date updated successfully"}


# 🔥 DETAIL VIEW
def get_fee_detail(db: Session, student_id: str):

    # 🔹 STUDENT
    student = db.query(Student).filter(
        Student.student_id == student_id
    ).first()

    # 🔹 FEE RECORD
    fee = db.query(Fee).filter(
        Fee.student_id == student_id
    ).first()

    # 🔹 PAYMENTS
    payments = db.query(Payment).filter(
        Payment.student_id == student_id
    ).all()

    # 🔹 DUE DATE
    due = db.query(CourseDueDate).filter(
        CourseDueDate.course == student.course
    ).first()

    # 🔥 PAYMENT HISTORY
    payment_history = []
    for pay in payments:
        payment_history.append({
            "date": pay.date,
            "amount": pay.amount,
            "method": pay.method,
            "status": pay.status
        })

    # 🔹 SUMMARY
    course_data = db.query(Course).filter(Course.course_name == student.course).first()
    total_fees = course_data.total_fee if course_data else (fee.total_fees if fee else 0)
    paid_amount = sum(p.amount for p in payments)
    pending_amount = max(0, total_fees - paid_amount)
    credit_balance = max(0, paid_amount - total_fees)

    return {
        "student_id": student.student_id,
        "name": student.name,
        "course": student.course,
        "total_fees": total_fees,
        "paid_amount": paid_amount,
        "pending_amount": pending_amount,
        "credit_balance": credit_balance,
        "due_date": due.due_date if due else None,
        "semester_breakdown": [],
        "payment_history": payment_history
    }

