import uuid
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from src.db.models import User
from src.auth.utils import generate_password_hash
class UserService:
    async def get_user_by_username(self, username: str, session: AsyncSession) -> User:
        statement = select(User).where(User.username == username)
        result = await session.exec(statement)
        user = result.first()
        return user

    async def user_exists(self, username: str, session: AsyncSession) -> bool:
        user = await self.get_user_by_username(username, session)
        return True if user is not None else False
    
    async def create_user(self, user: User, session: AsyncSession) -> User:
        user_data_dict = user.model_dump()
        new_user = User(**user_data_dict)

        new_user.password_hash = generate_password_hash(user.password)
        new_user.role = "user"

        session.add(new_user)
        return new_user
    
    async def update_user(self, user: User, user_data: dict, session: AsyncSession) -> User:
        for k, v in user_data.items():
            setattr(user, k, v)

        await session.commit()

        return user