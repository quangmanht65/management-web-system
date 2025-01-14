from fastapi import APIRouter, Depends, status, HTTPException
from sqlmodel.ext.asyncio.session import AsyncSession
from typing import List

from db.main import get_session
from auth.dependencies import AccessTokenBearer, RoleChecker
from payroll.schemas import PayrollCreate, PayrollUpdate, PayrollResponse
from payroll.service import PayrollService

payroll_router = APIRouter()
payroll_service = PayrollService()
access_token_bearer = AccessTokenBearer()
role_checker = Depends(RoleChecker(["admin", "user"]))

@payroll_router.post("/", response_model=PayrollResponse, dependencies=[role_checker])
async def create_payroll(
    payroll_data: PayrollCreate,
    session: AsyncSession = Depends(get_session),
    token_details: dict = Depends(access_token_bearer),
):
    """Create a new payroll record"""
    try:
        user_id = token_details.get("user")["uid"]
        payroll_dict = await payroll_service.create_payroll(payroll_data, user_id, session)
        return PayrollResponse(**payroll_dict)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@payroll_router.get("/", response_model=List[PayrollResponse], dependencies=[role_checker])
async def get_all_payrolls(
    session: AsyncSession = Depends(get_session),
    token_details: dict = Depends(access_token_bearer),
):
    """Get all payroll records"""
    try:
        user_id = token_details.get("user")["uid"]
        return await payroll_service.get_all_payrolls(session, user_id)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@payroll_router.get("/{payroll_id}", response_model=PayrollResponse, dependencies=[role_checker])
async def get_payroll(
    payroll_id: int,
    session: AsyncSession = Depends(get_session),
    token_details: dict = Depends(access_token_bearer),
):
    """Get a specific payroll record"""
    try:
        return await payroll_service.get_payroll_by_id(payroll_id, session)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@payroll_router.put("/{payroll_id}", response_model=PayrollResponse, dependencies=[role_checker])
async def update_payroll(
    payroll_id: int,
    payroll_data: PayrollUpdate,
    session: AsyncSession = Depends(get_session),
    token_details: dict = Depends(access_token_bearer),
):
    """Update a payroll record"""
    try:
        user_id = token_details.get("user")["uid"]
        return await payroll_service.update_payroll(payroll_id, payroll_data, user_id, session)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@payroll_router.delete("/{payroll_id}", dependencies=[role_checker])
async def delete_payroll(
    payroll_id: int,
    session: AsyncSession = Depends(get_session),
    token_details: dict = Depends(access_token_bearer),
):
    """Delete a payroll record"""
    try:
        user_id = token_details.get("user")["uid"]
        return await payroll_service.delete_payroll(payroll_id, user_id, session)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
