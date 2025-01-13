from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, status, BackgroundTasks
from fastapi.exceptions import HTTPException
from fastapi.responses import JSONResponse
from sqlmodel.ext.asyncio.session import AsyncSession

from auth.service import CustomerService
from auth.utils import create_access_token, create_refresh_token, verify_password
from auth.schemas import CustomerCreateModel, LoginModel
from db.main import get_session
from errors import InvalidCredentials
auth_router = APIRouter()
customer_service = CustomerService()

REFRESH_TOKEN_EXPIRY = 2

@auth_router.post("/signup", status_code=status.HTTP_201_CREATED)
async def create_customer_account(
    customer_data: CustomerCreateModel,
    bg_tasks: BackgroundTasks,
    session: AsyncSession = Depends(get_session),
):
    pass

@auth_router.post("/login", status_code=status.HTTP_200_OK)
async def login(
    login_data: LoginModel,
    session: AsyncSession = Depends(get_session),
):
    username = login_data.username
    password = login_data.password
    
    user = await customer_service.get_user_by_username(username, session)

    if user is not None:
        password_valid = verify_password(password, user.password_hash)

        if password_valid:
            access_token = create_access_token(
                user_data={
                    "username": user.username,
                    "uid": user.uid,
                    "role": user.role
                }
            )

            refresh_token = create_access_token(
                user_data={
                    "username": user.username,
                    "uid": user.uid,
                    "role": user.role
                },
                refresh=True,
                expiry=timedelta(days=REFRESH_TOKEN_EXPIRY)
            )

            return JSONResponse(
                content={
                    "message": "Login successful",
                    "access_token": access_token,
                    "refresh_token": refresh_token,
                    "user": {"username": user.username, "uid": user.uid, "role": user.role}
                },
            )
    raise InvalidCredentials()

