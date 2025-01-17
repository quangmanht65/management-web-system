from datetime import date, datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field
from db.models import Gender, MaritalStatus

class EmployeeCreate(BaseModel):
    employee_code: str = Field(..., min_length=1, max_length=8)
    position_id: int = Field(...)
    department_id: int = Field(...)
    salary: float = Field(..., gt=0)
    gender: Gender = Field(default=Gender.MALE)
    contract_id: str = Field(..., min_length=1, max_length=8)
    full_name: str = Field(..., min_length=1, max_length=50)
    birth_date: date
    birth_place: str = Field(..., max_length=100)
    id_number: str = Field(..., max_length=20)
    phone: str = Field(..., max_length=15)
    address: str = Field(..., max_length=250)
    email: EmailStr
    marital_status: MaritalStatus = Field(default=MaritalStatus.SINGLE)
    ethnicity: Optional[str] = Field(default="Kinh")
    education_level_id: Optional[str] = Field(default=None)
    id_card_date: Optional[date] = Field(default=None)
    id_card_place: Optional[str] = Field(default=None, max_length=50)
    health_insurance_number: str = Field(..., max_length=15)
    social_insurance_number: str = Field(..., max_length=15)
    profile_image_path: str = Field(default="none_image_profile", max_length=40)

class EmployeeUpdateModel(BaseModel):
    position_id: Optional[int] = None
    department_id: Optional[int] = None
    salary: Optional[float] = Field(None, gt=0)
    gender: Optional[Gender] = None
    contract_id: Optional[str] = Field(None, min_length=1, max_length=8)
    full_name: Optional[str] = Field(None, min_length=1, max_length=50)
    birth_date: Optional[date] = None
    birth_place: Optional[str] = Field(None, max_length=100)
    id_number: Optional[str] = Field(None, max_length=20)
    phone: Optional[str] = Field(None, max_length=15)
    address: Optional[str] = Field(None, max_length=250)
    email: Optional[EmailStr] = None
    marital_status: Optional[MaritalStatus] = None
    ethnicity: Optional[str] = Field(None, max_length=10)
    education_level_id: Optional[str] = Field(None, max_length=8)
    id_card_date: Optional[date] = None
    id_card_place: Optional[str] = Field(None, max_length=50)
    health_insurance_number: Optional[str] = Field(None, max_length=15)
    social_insurance_number: Optional[str] = Field(None, max_length=15)
    profile_image_path: Optional[str] = Field(None, max_length=40)

class ContractBase(BaseModel):
    contract_type: str = Field(..., max_length=50)
    start_date: date
    end_date: Optional[date] = None
    status: str = Field(..., max_length=20)
    salary: float = Field(..., gt=0)
    notes: Optional[str] = Field(default=None, max_length=500)

class ContractCreate(ContractBase):
    employee_id: int = Field(..., gt=0)
    employee_name: str = Field(..., min_length=1, max_length=50)
    start_date: date
    end_date: Optional[date] = None
    status: str = Field(..., max_length=20)
    salary: float = Field(..., gt=0)
    notes: Optional[str] = Field(default=None, max_length=500)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = Field(default=None)

class ContractUpdate(ContractBase):
    employee_id: Optional[int] = Field(None, gt=0)
    employee_name: Optional[str] = Field(None, min_length=1, max_length=50)   
    contract_type: Optional[str] = Field(None, max_length=50)
    start_date: Optional[date] = None 
    end_date: Optional[date] = None
    status: Optional[str] = Field(None, max_length=20)
    salary: Optional[float] = Field(None, gt=0)
    notes: Optional[str] = Field(None, max_length=500)

class ContractResponse(ContractBase):
    id: int
    employee_id: int
    employee_name: Optional[str]
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True 

class PositionRead(BaseModel):
    id: int
    position_code: str
    name: str
    description: Optional[str] = None
    employee_count: int = 0

    class Config:
        from_attributes = True 