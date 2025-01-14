from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from typing import List

from db.models import Position
from position.schemas import PositionCreate, PositionUpdate
from errors import PositionNotFound

class PositionService:
    async def create_position(self, position_data: PositionCreate, session: AsyncSession) -> Position:
        position = Position(**position_data.model_dump())
        session.add(position)
        await session.commit()
        await session.refresh(position)
        return position

    async def get_all_positions(self, session: AsyncSession) -> List[Position]:
        statement = select(Position)
        result = await session.execute(statement)
        return result.scalars().all()

    async def get_position_by_id(self, position_id: int, session: AsyncSession) -> Position:
        statement = select(Position).where(Position.id == position_id)
        result = await session.execute(statement)
        return result.scalar_one_or_none()

    async def get_position_by_code(self, code: str, session: AsyncSession) -> Position:
        statement = select(Position).where(Position.position_code == code)
        result = await session.execute(statement)
        return result.scalar_one_or_none()

    async def update_position(self, position_id: int, position_data: PositionUpdate, session: AsyncSession) -> Position:
        position = await self.get_position_by_id(position_id, session)
        if not position:
            raise PositionNotFound()
        
        for key, value in position_data.model_dump().items():
            setattr(position, key, value)
        
        await session.commit()
        await session.refresh(position)
        return position

    async def delete_position(self, position_id: int, session: AsyncSession) -> None:
        position = await self.get_position_by_id(position_id, session)
        if not position:
            raise PositionNotFound()
        
        await session.delete(position)
        await session.commit() 