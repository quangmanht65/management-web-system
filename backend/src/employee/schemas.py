from datetime import date
from typing import Optional
from pydantic import BaseModel, EmailStr, Field

class EmployeeCreate(BaseModel):
    EmployeeID: str = Field(..., min_length=1, max_length=8)
    PositionID: str = Field(..., min_length=1, max_length=8)
    DepartmentID: str = Field(..., min_length=1, max_length=8)
    Salary: float = Field(..., gt=0)
    Gender: str = Field(default="Male")
    ContractID: str = Field(..., min_length=1, max_length=8)
    EmployeeName: str = Field(..., min_length=1, max_length=50)
    DateOfBirth: date
    PlaceOfBirth: str = Field(..., max_length=100)
    IDNumber: str = Field(..., max_length=20)
    Phone: str = Field(..., max_length=20)
    Address: str = Field(..., max_length=250)
    Email: EmailStr
    MaritalStatus: str = Field(default="Single")
    Ethnicity: Optional[str] = Field(default="Kinh")
    EducationLevelID: Optional[str] = None
    IDCardDate: Optional[date] = None
    IDCardPlace: Optional[str] = None
    HealthInsurance: str = Field(..., max_length=15)
    SocialInsurance: str = Field(..., max_length=15)
    ID_profile_image: str = Field(default="none_image_profile") 

class EmployeeUpdateModel(BaseModel):
    EmployeeName: str = Field(..., min_length=1, max_length=50)
    DateOfBirth: date
    PlaceOfBirth: str = Field(..., max_length=100)
    IDNumber: str = Field(..., max_length=20)
    Phone: str = Field(..., max_length=20)
    Address: str = Field(..., max_length=250)
    Email: EmailStr
    MaritalStatus: str = Field(default="Single")
    Ethnicity: Optional[str] = Field(default="Kinh")
    EducationLevelID: Optional[str] = None
    IDCardDate: Optional[date] = None
    IDCardPlace: Optional[str] = None
    HealthInsurance: str = Field(..., max_length=15)
    SocialInsurance: str = Field(..., max_length=15)
    ID_profile_image: str = Field(default="none_image_profile") 