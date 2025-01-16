from typing import Any
from fastapi import Depends, Request, status, HTTPException
from fastapi.security import HTTPBearer
from fastapi.security.http import HTTPAuthorizationCredentials
from sqlmodel.ext.asyncio.session import AsyncSession
import jwt
import logging

from db.main import get_session
from db.models import User
from .service import UserService
from .utils import decode_token
from errors.auth_errors import RefreshTokenRequired

user_service = UserService()

class TokenBearer:
    def __init__(self, auto_error: bool = True):
        self.security = HTTPBearer(auto_error=auto_error)

    async def __call__(
        self,
        credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer())
    ) -> dict:
        """Base token validation"""
        try:
            token = credentials.credentials
            token_data = decode_token(token)
            
            if not token_data:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Could not validate credentials",
                    headers={"WWW-Authenticate": "Bearer"},
                )
            
            # Allow child classes to perform additional validation
            self.verify_token_data(token_data)
            
            return token_data
            
        except jwt.ExpiredSignatureError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token has expired",
                headers={"WWW-Authenticate": "Bearer"},
            )
        except jwt.InvalidTokenError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token",
                headers={"WWW-Authenticate": "Bearer"},
            )
        except Exception as e:
            logging.error(f"Token validation error: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authentication failed",
                headers={"WWW-Authenticate": "Bearer"},
            )

    def verify_token_data(self, token_data: dict) -> None:
        """Override in child classes for specific token validation"""
        pass

class AccessTokenBearer(TokenBearer):
    def verify_token_data(self, token_data: dict) -> None:
        """Verify this is an access token, not a refresh token"""
        if token_data.get("refresh"):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Access token required",
                headers={"WWW-Authenticate": "Bearer"},
            )

class RefreshTokenBearer(TokenBearer):
    def verify_token_data(self, token_data: dict) -> None:
        """Verify this is a refresh token"""
        if not token_data.get("refresh"):
            raise RefreshTokenRequired()

async def get_current_user(
    token_data: dict = Depends(AccessTokenBearer()),
    session: AsyncSession = Depends(get_session),
) -> User:
    """Get current user from token data"""
    try:
        user_info = token_data.get("user", {})
        username = user_info.get("username")
        
        if not username:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token data",
            )
            
        user = await user_service.get_user_by_username(username, session)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found",
            )
            
        return user
        
    except Exception as e:
        logging.error(f"Error getting current user: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication failed",
        )

class RoleChecker:
    def __init__(self, allowed_roles: list):
        self.allowed_roles = allowed_roles

    def __call__(self, token_data: dict = Depends(AccessTokenBearer())) -> bool:
        """Check if user has required role"""
        try:
            user = token_data.get("user", {})
            user_role = user.get("role")
            
            if not user_role or user_role not in self.allowed_roles:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Operation not permitted"
                )
                
            return True
            
        except Exception as e:
            logging.error(f"Role check error: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Permission check failed"
            )