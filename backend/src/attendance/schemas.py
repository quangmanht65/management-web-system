from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, Field

class AttendanceBase(BaseModel):
    employee_id: int = Field(..., gt=0)
    date: date
    status: str = Field(..., max_length=20)
    notes: Optional[str] = Field(default=None)

class AttendanceCreate(AttendanceBase):
    pass

class AttendanceUpdate(AttendanceBase):
    pass

class AttendanceResponse(AttendanceBase):
    id: int
    employee_name: Optional[str]
    employee_code: Optional[str]
    department: Optional[str]
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True 