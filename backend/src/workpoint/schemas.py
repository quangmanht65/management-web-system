from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field

class WorkPointBase(BaseModel):
    employee_id: int = Field(..., gt=0)
    month: int = Field(..., ge=1, le=12)
    year: int = Field(...)
    day: int = Field(..., ge=1, le=31)
    points: float = Field(default=1.0, ge=0, le=1)
    notes: Optional[str] = Field(default=None)

class WorkPointCreate(WorkPointBase):
    pass

class WorkPointUpdate(WorkPointBase):
    pass

class WorkPointResponse(WorkPointBase):
    id: int
    employee_name: Optional[str]
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True 