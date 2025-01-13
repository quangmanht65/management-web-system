from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse
from sqlmodel.ext.asyncio.session import AsyncSession
from typing import List

from db.main import get_session
from employee.schemas import EmployeeCreate, EmployeeUpdateModel
from employee.service import EmployeeService
from errors import EmployeeAlreadyExists, EmployeeNotFound
from db.models import Employee
from auth.dependencies import AccessTokenBearer, RoleChecker

employee_router = APIRouter()
employee_service = EmployeeService()
access_token_bearer = AccessTokenBearer()
role_checker = Depends(RoleChecker(["admin", "user"]))


@employee_router.get("/", response_model=List[Employee], dependencies=[role_checker])                     
async def get_all_employees(
    session: AsyncSession = Depends(get_session),
    _: dict = Depends(access_token_bearer),
) -> List[Employee]:
    """Get all employees"""
    employees = await employee_service.get_all_employees(session)
    
    return employees

@employee_router.post("/",
    status_code=status.HTTP_201_CREATED,
    response_model=Employee,
    dependencies=[role_checker]
)
async def create_employee(
    employee_data: EmployeeCreate,
    session: AsyncSession = Depends(get_session),
):
    """Create a new employee"""

    employee_exists = await employee_service.employee_exists(employee_data.EmployeeID, session)

    if employee_exists:
        raise EmployeeAlreadyExists()
    new_employee = await employee_service.create_employee(employee_data, session)

    return {
        "message": "Employee created successfully",
        "employee": new_employee
    }

@employee_router.get("/{employee_id}", response_model=Employee, dependencies=[role_checker])
async def get_employee_by_id(
    employee_id: str,
    session: AsyncSession = Depends(get_session),
    _: dict = Depends(access_token_bearer),
) -> Employee:
    """Get employee by ID"""
    employee = await employee_service.get_employee_by_id(employee_id, session)
    return employee

@employee_router.patch("/{employee_id}", response_model=Employee, dependencies=[role_checker])
async def update_employee(
    employee_id: str,
    employee_data: EmployeeUpdateModel,
    session: AsyncSession = Depends(get_session),
    _: dict = Depends(access_token_bearer),
) -> Employee:
    """Update an employee"""

    employee = await employee_service.get_employee_by_id(employee_id, session)

    if not employee:
        raise EmployeeNotFound()
    
    updated_employee = await employee_service.update_employee(employee_id, employee_data, session)

    return updated_employee

@employee_router.delete("/{employee_id}", dependencies=[role_checker])
async def delete_employee(
    employee_id: str,
    session: AsyncSession = Depends(get_session),
    _: dict = Depends(access_token_bearer),
) -> None:
    """Delete an employee"""
    await employee_service.delete_employee(employee_id, session)
    return {"message": "Employee deleted successfully"}
