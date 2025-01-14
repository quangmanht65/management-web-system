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


@employee_router.get("/", response_model=List[dict])
async def get_all_employees(
    session: AsyncSession = Depends(get_session),
    _: dict = Depends(access_token_bearer),
) -> List[dict]:
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
    token_details: dict = Depends(access_token_bearer)
):
    """Create a new employee"""
    user_id = token_details.get("user")["uid"]
    return await employee_service.create_employee(employee_data, user_id, session)

@employee_router.get("/{employee_id}", response_model=Employee, dependencies=[role_checker])
async def get_employee_by_id(
    employee_id: str,
    session: AsyncSession = Depends(get_session),
    _: dict = Depends(access_token_bearer),
) -> Employee:
    """Get employee by ID"""
    employee = await employee_service.get_employee_by_id(employee_id, session)
    
    return employee if employee else JSONResponse(content={"message": "Employee not found"}, status_code=status.HTTP_404_NOT_FOUND)

@employee_router.patch("/{employee_id}", response_model=Employee, dependencies=[role_checker])
async def update_employee(
    employee_id: str,
    employee_data: EmployeeUpdateModel,
    session: AsyncSession = Depends(get_session),
    _: dict = Depends(access_token_bearer),
) -> Employee:
    """Update an employee"""
    return await employee_service.update_employee(employee_id, employee_data, session)

@employee_router.delete("/{employee_id}", dependencies=[role_checker])
async def delete_employee(
    employee_id: str,
    session: AsyncSession = Depends(get_session),
    _: dict = Depends(access_token_bearer),
) -> JSONResponse:
    """Delete an employee"""
    result = await employee_service.delete_employee(employee_id, session)
    return JSONResponse(content=result)

@employee_router.get("/count/", status_code=status.HTTP_200_OK, dependencies=[role_checker])
async def get_employee_count(
    session: AsyncSession = Depends(get_session),
    token_details: dict = Depends(access_token_bearer)
):
    """Get total number of employees"""
    user_id = token_details.get("user")["uid"]
    return await employee_service.get_count(user_id, session)
