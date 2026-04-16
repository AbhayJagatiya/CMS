from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import require_role
from app.analytics import services, schemas

router = APIRouter(prefix="/analytics", tags=["Analytics"])

# 🔐 Access: ADMIN or MANAGERS can view analytics
role_access = Depends(require_role(["ADMIN", "STUDENT_MANAGER", "FEES_MANAGER", "ATTENDANCE_MANAGER"]))

@router.get("/dashboard", response_model=schemas.DashboardAnalyticsResponse, dependencies=[role_access])
def get_dashboard_data(db: Session = Depends(get_db)):
    return services.get_dashboard_analytics(db)
