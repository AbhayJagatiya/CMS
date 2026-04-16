from pydantic import BaseModel
from typing import List, Dict
from datetime import date

class StatCardData(BaseModel):
    students: str
    attendance: str
    courses: str
    activeCourses: str
    fees: str

class TrendData(BaseModel):
    name: str
    value: float

class FeeTrendData(BaseModel):
    name: str
    actual: float
    projected: float

class TopPerformer(BaseModel):
    name: str
    course: str
    percentage: float

class RecentAttendance(BaseModel):
    student_id: str
    name: str
    course: str
    status: str
    date: date

class DashboardAnalyticsResponse(BaseModel):
    stats: StatCardData
    attendanceTrends: List[TrendData]
    feeTrends: List[FeeTrendData]
    topPerformers: List[TopPerformer]
    recentAttendance: List[RecentAttendance]
