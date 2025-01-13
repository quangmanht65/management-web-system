from pydantic import BaseModel
from typing import Optional

class DepartmentCreate(BaseModel):
    DepartmentID: str
    DepartmentName: str
    Description: Optional[str] = None
    Location: Optional[str] = None
    PhoneNumber: Optional[str] = None

class DepartmentUpdateModel(BaseModel):
    DepartmentName: Optional[str] = None
    Description: Optional[str] = None
    Location: Optional[str] = None
    PhoneNumber: Optional[str] = None
