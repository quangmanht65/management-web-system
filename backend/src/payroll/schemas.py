from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, Field

class PayrollBase(BaseModel):
    employee_id: int = Field(..., gt=0)
    month: date
    base_salary: float = Field(..., gt=0)
    allowance: float = Field(default=0, ge=0)
    deduction: float = Field(default=0, ge=0)
    notes: Optional[str] = Field(default=None, max_length=500)

class PayrollCreate(PayrollBase):
    pass

class PayrollUpdate(PayrollBase):
    pass

class PayrollResponse(PayrollBase):
    id: int
    employee_name: Optional[str]
    net_salary: float
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True 