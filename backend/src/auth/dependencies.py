from typing import Any, List

from fastapi import Depends, Request, status
from fastapi.exceptions import HTTPException
from fastapi.security import HTTPBearer
from fastapi.security.http import HTTPAuthorizationCredentials
from sqlmodel.ext.asyncio.session import AsyncSession

from db.main import get_session
from db.models import User

from .service import UserService
from .utils import decode_token
from errors import (
    UserNotFound,
    InvalidCredentials,
    UserAlreadyExists,
    RefreshTokenRequired,
    AccessTokenRequired,
    InsufficientPermission,
    AccountNotVerified,
    EmployeeNotFound,
    EmployeeAlreadyExists
)

user_service = UserService()


class TokenBearer(HTTPBearer):
    def __init__(self, auto_error: bool = True):
        super().__init__(auto_error=auto_error)

    async def __call__(self, request: Request) -> HTTPAuthorizationCredentials | None:
        creds = await super().__call__(request)

        token = creds.credentials

        token_data = decode_token(token)

        if not self.token_valid(token):
            raise InvalidCredentials

        return token_data
    
    def token_valid(self, token: str) -> bool:
        token_data = decode_token(token)

        return token_data is not None
    
    def verify_token_data(self, token_data):
        raise NotImplementedError("Please override in child class")
    

class AccessTokenBearer(TokenBearer):
    def verify_token_data(self, token_data: dict) -> bool:
        if token_data and token_data["refresh"]:
            raise AccessTokenRequired()
        
class RefreshTokenBearer(TokenBearer):
    def verify_token_data(self, token_data: dict) -> bool:
        if token_data and not token_data["refresh"]:
            raise RefreshTokenRequired()
        
async def get_current_user(
    token_details: dict = Depends(AccessTokenBearer()),
    session: AsyncSession = Depends(get_session),
) -> User:
    
    print("token_details: ", token_details)
    print('type(token_details): ', type(token_details))

    username = token_details.get("user")["username"]

    print("username: ", username)

    user = await user_service.get_user_by_username(username, session)

    return user

        
class RoleChecker:
    def __init__(self, allowed_roles: List[str]) -> None:
        self.allowed_roles = allowed_roles

    def __call__(self, current_user: User = Depends(get_current_user)) -> Any:        
        print("current_user: ", current_user)
        print('type(current_user): ', type(current_user))
        if not current_user.is_verified:
            raise AccountNotVerified()
        
        if current_user.role in self.allowed_roles:
            return True
        
        raise InsufficientPermission()