from pydantic import BaseModel


class CourseBase(BaseModel):
    course_id: str
    institute: str
    course_name: str
    total_fee: int
    duration: str
    faculty: str
    status: str


class CourseCreate(CourseBase):
    pass


class CourseResponse(CourseBase):
    id: int
    enrollment: int  # 🔥 student count

    class Config:
        from_attributes = True


# 🔥 detail view
class CourseDetailResponse(BaseModel):
    course_id: str
    course_name: str
    duration: str
    total_fee: int
    faculty: str
    students: list

    class Config:
        from_attributes = True

class CourseUpdate(BaseModel):
    course_id: str
    institute: str
    course_name: str
    total_fee: int
    duration: str
    faculty: str
    status: str