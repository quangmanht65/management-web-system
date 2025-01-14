from pydantic import BaseModel
from typing import Optional

class DepartmentCreate(BaseModel):
    department_code: str
    name: str

class DepartmentUpdateModel(BaseModel):
    department_code: Optional[str] = None
    name: Optional[str] = None
