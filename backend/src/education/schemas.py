from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class EducationBase(BaseModel):
    degree_name: str
    school: str
    major: str
    graduation_year: str
    ranking: str

class EducationCreate(EducationBase):
    employee_id: int

    class Config:
        from_attributes = True

class EducationResponse(EducationBase):
    id: int
    employee_id: int
    