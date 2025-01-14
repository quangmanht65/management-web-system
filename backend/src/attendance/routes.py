from fastapi import APIRouter, Depends, status, HTTPException
from sqlmodel.ext.asyncio.session import AsyncSession
from typing import List
from datetime import date

from db.main import get_session
from auth.dependencies import AccessTokenBearer, RoleChecker
from attendance.schemas import AttendanceCreate, AttendanceResponse
from attendance.service import AttendanceService

attendance_router = APIRouter()
attendance_service = AttendanceService()
access_token_bearer = AccessTokenBearer()
role_checker = Depends(RoleChecker(["admin", "user"]))

@attendance_router.post("/", response_model=AttendanceResponse)
async def create_attendance(
    attendance_data: AttendanceCreate,
    session: AsyncSession = Depends(get_session),
    _: dict = Depends(access_token_bearer),
):
    """Create or update attendance record"""
    return await attendance_service.create_or_update_attendance(attendance_data, session)

@attendance_router.get("/", response_model=List[AttendanceResponse])
async def get_attendance(
    date: date,
    session: AsyncSession = Depends(get_session),
    _: dict = Depends(access_token_bearer),
):
    """Get attendance records for a specific date"""
    return await attendance_service.get_attendance_by_date(date, session) 