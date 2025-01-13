import uuid
from datetime import date, datetime
from typing import Optional
import sqlalchemy.dialects.mysql as mysql
from sqlmodel import Field, Relationship, SQLModel, Column
from enum import Enum

class UserRole(str, Enum):
    USER = "user"
    ADMIN = "admin"

class User(SQLModel, table=True):
    __tablename__ = "users"

    uid: str = Field(
        sa_column=Column(mysql.VARCHAR(36), nullable=False, primary_key=True, default=lambda: str(uuid.uuid4()))
    )

    username: str
    password_hash: str = Field(
        sa_column=Column(mysql.VARCHAR(255), nullable=False),
        exclude=True
    )
    role: UserRole = Field(default=UserRole.USER)
    is_verified: bool = Field(default=False)
    created_at: datetime = Field(
        sa_column=Column(mysql.TIMESTAMP, default=datetime.now())   
    )
    updated_at: datetime = Field(
        sa_column=Column(mysql.TIMESTAMP, default=datetime.now(), onupdate=datetime.now())
    )

    def __repr__(self):
        return f"<User {self.username}>"



# class Position(SQLModel, table=True):
#     __tablename__ = "hrm_position"
    
#     PositionID: str = Field(primary_key=True)
#     PositionName: str

# class WorkingTime(SQLModel, table=True):
#     __tablename__ = "hrm_workingtime"
    
#     id: str = Field(primary_key=True)
#     EmployeeID: str = Field(foreign_key="hrm_employee.EmployeeID") 
#     PositionID: str
#     StartDate: datetime
#     EndDate: datetime
#     IsActive: str

# class Education(SQLModel, table=True):
#     __tablename__ = "hrm_education"
    
#     EducationID: str = Field(primary_key=True)
#     EducationName: str
#     Major: str

# class Department(SQLModel, table=True):
#     __tablename__ = "hrm_department"
    
#     DepartmentID: str = Field(primary_key=True)
#     DepartmentName: str
#     Address: str
#     Phone: str
#     ManagerID: str

# class Employee(SQLModel, table=True):
#     __tablename__ = "hrm_employee"
    
#     EmployeeID: str = Field(primary_key=True)
#     PositionID: str
#     DepartmentID: str
#     Salary: float
#     Gender: str
#     IDNumber: str
#     FullName: str
#     DateOfBirth: date
#     PlaceOfBirth: str
#     IDCard: str
#     Phone: str
#     Address: str
#     Email: str
#     MaritalStatus: str
#     Ethnicity: str
#     EducationID: str = Field(foreign_key="hrm_education.EducationID")
#     IDCardDate: date
#     IDCardPlace: str
#     HealthInsurance: str
#     SocialInsurance: str
#     ProfileImageID: Optional[str]

# class Salary(SQLModel, table=True):
#     __tablename__ = "hrm_salary"
    
#     EmployeeID: str = Field(primary_key=True)
#     Year: int
#     Month: int
#     BaseSalary: float
#     WorkingSalary: float
#     Bonus: float
#     Deduction: float
#     TotalAmount: float