from typing import List

from fastapi import Depends, Request, status
from fastapi.exceptions import HTTPException
from fastapi.security import HTTPBearer
from fastapi.security.http import HTTPAuthorizationCredentials
from sqlmodel.ext.asyncio.session import AsyncSession

from db.main import get_session
from db.models import User

from service import UserService
from utils import decode_token
from errors import (
    UserNotFound,
    InvalidCredentials,
    UserAlreadyExists,
    RefreshTokenRequired,
    AccessTokenRequired,
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
        