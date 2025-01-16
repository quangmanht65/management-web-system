from fastapi import APIRouter, Depends, status, HTTPException
from fastapi.responses import JSONResponse
from sqlmodel import select, Session as AsyncSession
from typing import List
from sqlalchemy import func

from db.main import get_session
from employee.schemas import (
    EmployeeCreate, 
    EmployeeUpdateModel, 
    ContractCreate, 
    ContractUpdate, 
    ContractResponse,
    PositionRead
)
from employee.service import EmployeeService
from errors.employee_errors import EmployeeAlreadyExists, EmployeeNotFound
from db.models import Employee, Position
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

@employee_router.post("/contracts/", response_model=ContractResponse)
async def create_contract(
    contract_data: ContractCreate,
    session: AsyncSession = Depends(get_session),
    token_details: dict = Depends(access_token_bearer),
):
    """Create a new contract for an employee"""
    user_id = token_details.get("user")["uid"]
    contract_dict = await employee_service.create_contract(contract_data, user_id, session)
    return ContractResponse(**contract_dict)

@employee_router.get("/contracts/{employee_id}", response_model=List[ContractResponse])
async def get_employee_contracts(
    employee_id: str,
    session: AsyncSession = Depends(get_session),
    token_details: dict = Depends(access_token_bearer),
):
    """Get all contracts for an employee"""
    user_id = token_details.get("user")["uid"]
    return await employee_service.get_employee_contracts(employee_id, user_id, session)

@employee_router.get("/contracts/detail/{contract_id}", response_model=ContractResponse)
async def get_contract(
    contract_id: int,
    session: AsyncSession = Depends(get_session),
    token_details: dict = Depends(access_token_bearer),
):
    """Get a specific contract by ID"""
    user_id = token_details.get("user")["uid"]
    return await employee_service.get_contract_by_id(contract_id, user_id, session)

@employee_router.put("/contracts/{contract_id}", response_model=ContractResponse)
async def update_contract(
    contract_id: int,
    contract_data: ContractUpdate,
    session: AsyncSession = Depends(get_session),
    token_details: dict = Depends(access_token_bearer),
):
    """Update a contract"""
    user_id = token_details.get("user")["uid"]
    return await employee_service.update_contract(contract_id, contract_data, user_id, session)

@employee_router.delete("/contracts/{contract_id}")
async def delete_contract(
    contract_id: int,
    session: AsyncSession = Depends(get_session),
    token_details: dict = Depends(access_token_bearer),
):
    """Delete a contract"""
    user_id = token_details.get("user")["uid"]
    return await employee_service.delete_contract(contract_id, user_id, session)


@employee_router.get("/contracts/", response_model=List[ContractResponse])
async def get_all_contracts(
    session: AsyncSession = Depends(get_session),
    token_details: dict = Depends(access_token_bearer),
):
    """Get all contracts"""
    return await employee_service.get_all_contracts(session)

@employee_router.get("/positions/", response_model=List[PositionRead])
async def get_positions(
    session: AsyncSession = Depends(get_session),
    _: dict = Depends(access_token_bearer)
):
    """Get all positions with employee count"""
    try:
        statement = select(
            Position,
            func.count(Employee.id).label('employee_count')
        ).outerjoin(
            Employee, 
            Position.id == Employee.position_id
        ).group_by(Position.id)
        
        result = await session.execute(statement)
        positions = []
        
        for position, count in result:
            position_dict = {
                "id": position.id,
                "position_code": position.position_code,
                "name": position.title,
                "description": position.description if hasattr(position, 'description') else None,
                "employee_count": count
            }
            positions.append(position_dict)
            
        return positions
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )