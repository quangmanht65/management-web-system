from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncEngine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlmodel import SQLModel, create_engine
import logging

from config import settings

async_engine = AsyncEngine(
    create_engine(
        url=settings.DATABASE_URL,
        echo=True,
        future=True
    )
)

async def init_db() -> None:
    async with async_engine.begin() as conn:
        from db.models import User
        await conn.run_sync(SQLModel.metadata.create_all)


async def get_session() -> AsyncSession:
    Session = sessionmaker(
        bind=async_engine, class_=AsyncSession, expire_on_commit=False
    )

    async with Session() as session:
        try:
            yield session
        except Exception as e:
            logging.error(f"Database session error: {str(e)}")
            await session.rollback()
            raise
        finally:
            await session.close()   