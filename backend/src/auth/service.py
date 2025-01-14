import uuid
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from typing import List
from fastapi import HTTPException, status

from db.models import User, UserRole
from auth.schemas import UserCreateModel
from auth.utils import generate_password_hash

class UserService:
    async def get_user_by_id(self, user_id: str, session: AsyncSession) -> User:
        """Get user by ID"""
        statement = select(User).where(User.uid == user_id)
        result = await session.execute(statement)
        return result.scalar_one_or_none()

    async def get_user_by_username(self, username: str, session: AsyncSession) -> User:
        print("username: ", username)
        statement = select(User).where(User.username == username)
        result = await session.execute(statement)
        return result.scalar_one_or_none()

    async def user_exists(self, username: str, session: AsyncSession) -> bool:
        user = await self.get_user_by_username(username, session)
        return True if user is not None else False
    
    async def create_user(self, user_data: UserCreateModel, session: AsyncSession):
        print('user_data', user_data);
        user = User(
            username=user_data.username,
            password_hash=generate_password_hash(user_data.password),
            role=UserRole(user_data.role)
        )
        print('user', user);
        session.add(user)
        await session.commit()
        await session.refresh(user)
        return user
    
    async def update_user(self, user: User, user_data: dict, session: AsyncSession) -> User:
        for k, v in user_data.items():
            setattr(user, k, v)

        await session.commit()

        return user

    async def get_all_users(self, session: AsyncSession) -> List[dict]:
        """Get all users"""
        try:
            print("Getting all users")
            statement = select(User)
            result = await session.execute(statement)
            users = result.scalars().all()
            
            # Convert to list of dicts and remove sensitive info
            user_list = []
            for user in users:
                user_dict = {
                    "id": user.uid,
                    "username": user.username,
                    "role": user.role,
                    "is_verified": user.is_verified,
                    "created_at": user.created_at
                }
                user_list.append(user_dict)
            
            return user_list
        except Exception as e:
            print(f"Error getting users: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to fetch users"
            )