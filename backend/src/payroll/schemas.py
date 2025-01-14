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
    employee_id: int = Field(..., gt=0)
    month: date
    base_salary: float = Field(..., gt=0)
    allowance: float = Field(default=0, ge=0)
    deduction: float = Field(default=0, ge=0)
    notes: Optional[str] = Field(default=None, max_length=500)

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

    @classmethod
    def from_orm_with_computed(cls, payroll: "Payroll", employee_name: str = None):
        # Calculate net salary
        net_salary = payroll.base_salary + payroll.allowance - payroll.deduction
        
        # Create dict with all fields
        data = {
            **payroll.__dict__,
            'employee_name': employee_name or 'N/A',
            'net_salary': net_salary
        }
        
        if '_sa_instance_state' in data:
            del data['_sa_instance_state']
            
        return cls(**data) 