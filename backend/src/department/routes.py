from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse
from sqlmodel.ext.asyncio.session import AsyncSession
from typing import List

from db.main import get_session
from department.schemas import DepartmentCreate, DepartmentUpdateModel
from department.service import DepartmentService
from errors import DepartmentAlreadyExists, DepartmentNotFound
from db.models import Department
from auth.dependencies import AccessTokenBearer, RoleChecker

department_router = APIRouter()
department_service = DepartmentService()
access_token_bearer = AccessTokenBearer()
role_checker = Depends(RoleChecker(["admin", "user"]))

@department_router.get("/", response_model=List[dict], dependencies=[role_checker])
async def get_all_departments(
    session: AsyncSession = Depends(get_session),
    _: dict = Depends(access_token_bearer),
) -> List[dict]:
    """Get all departments"""
    departments = await department_service.get_all_departments(session)
    return departments

@department_router.post("/",
    status_code=status.HTTP_201_CREATED,
    response_model=Department,
    dependencies=[role_checker]
)
async def create_department(
    department_data: DepartmentCreate,
    session: AsyncSession = Depends(get_session),
    token_details: dict = Depends(access_token_bearer)
):
    """Create a new department"""

    user_id = token_details.get("user")["uid"]
    new_department = await department_service.create_department(department_data, user_id, session)
    return new_department


@department_router.get("/{department_id}", response_model=Department, dependencies=[role_checker])
async def get_department_by_id(
    department_id: str,
    session: AsyncSession = Depends(get_session),
    _: dict = Depends(access_token_bearer),
) -> Department:
    """Get department by ID"""
    department = await department_service.get_department_by_id(department_id, session)
    if not department:
        raise DepartmentNotFound()
    return department

@department_router.patch("/{department_id}", response_model=Department, dependencies=[role_checker])
async def update_department(
    department_id: str,
    department_data: DepartmentUpdateModel,
    session: AsyncSession = Depends(get_session),
    _: dict = Depends(access_token_bearer),
) -> Department:
    """Update a department"""
    updated_department = await department_service.update_department(department_id, department_data, session)
    return updated_department

@department_router.delete("/{department_id}", dependencies=[role_checker])
async def delete_department(
    department_id: str,
    session: AsyncSession = Depends(get_session),
    _: dict = Depends(access_token_bearer),
) -> JSONResponse:
    """Delete a department"""
    await department_service.delete_department(department_id, session)
    return JSONResponse(content={"message": "Department deleted successfully"})

@department_router.get("/count/", status_code=status.HTTP_200_OK, dependencies=[role_checker])
async def get_department_count(
    session: AsyncSession = Depends(get_session),
    _: dict = Depends(AccessTokenBearer())
):
    """Get total number of departments"""
    count = await department_service.get_count(session)
    return {"count": count} 