from sqlalchemy.orm import Session
from app.auth.models import User


def create_faculty(db: Session, data):

    user = User(
        name=data.name,
        email=data.email,
        phone=data.phone,
        employee_id=data.employee_id,
        role=data.role,
        password=data.password
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


def get_all_faculty(db: Session):
    return db.query(User).filter(User.role != "ADMIN").all()


def reset_password(db: Session, data):

    user = db.query(User).filter(User.id == data.faculty_id).first()

    if not user:
        return None

    user.password = data.new_password

    db.commit()
    return {"msg": "Password updated"}