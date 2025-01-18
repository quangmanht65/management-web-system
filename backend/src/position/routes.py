from fastapi import APIRouter, Depends, status
from sqlmodel.ext.asyncio.session import AsyncSession
from typing import List

from db.main import get_session
from position.schemas import PositionCreate, PositionRead, PositionUpdate
from position.service import PositionService
from errors import PositionNotFound, PositionAlreadyExists
from auth.dependencies import AccessTokenBearer, RoleChecker

position_router = APIRouter()
position_service = PositionService()
access_token_bearer = AccessTokenBearer()
admin_checker = RoleChecker(["admin", "user"])

@position_router.post("/", response_model=PositionRead, status_code=status.HTTP_201_CREATED)
async def create_position(
    position_data: PositionCreate,
    session: AsyncSession = Depends(get_session),
    _: dict = Depends(access_token_bearer),
    __: dict = Depends(admin_checker)
):
    existing_position = await position_service.get_position_by_code(position_data.position_code, session)
    if existing_position:
        raise PositionAlreadyExists()
    
    return await position_service.create_position(position_data, session)

@position_router.get("/", response_model=List[PositionRead])
async def get_all_positions(
    session: AsyncSession = Depends(get_session),
    _: dict = Depends(access_token_bearer)
):
    return await position_service.get_all_positions(session)

@position_router.get("/{position_id}", response_model=PositionRead)
async def get_position(
    position_id: int,
    session: AsyncSession = Depends(get_session),
    _: dict = Depends(access_token_bearer)
):
    position = await position_service.get_position_by_id(position_id, session)
    if not position:
        raise PositionNotFound()
    return position

@position_router.patch("/{position_id}", response_model=PositionRead)
async def update_position(
    position_id: int,
    position_data: PositionUpdate,
    session: AsyncSession = Depends(get_session),
    _: dict = Depends(access_token_bearer),
    __: dict = Depends(admin_checker)
):
    return await position_service.update_position(position_id, position_data, session)

@position_router.delete("/{position_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_position(
    position_id: int,
    session: AsyncSession = Depends(get_session),
    _: dict = Depends(access_token_bearer),
    __: dict = Depends(admin_checker)
):
    await position_service.delete_position(position_id, session) 