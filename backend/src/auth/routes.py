from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, status, BackgroundTasks
from fastapi.exceptions import HTTPException
from fastapi.responses import JSONResponse
from sqlmodel.ext.asyncio.session import AsyncSession

from auth.service import UserService
from auth.utils import create_access_token, verify_password, create_url_safe_token, decode_url_safe_token
from auth.schemas import UserCreateModel, LoginModel, MailModel
from db.main import get_session
from errors import InvalidCredentials, UserAlreadyExists, UserNotFound, InvalidToken
from .dependencies import RefreshTokenBearer, AccessTokenBearer
from config import Config
from auth.dependencies import RoleChecker

auth_router = APIRouter()
user_service = UserService()
role_checker = Depends(RoleChecker(["admin"]))
access_token_bearer = AccessTokenBearer()

REFRESH_TOKEN_EXPIRY = 2


@auth_router.post("/signup", status_code=status.HTTP_201_CREATED)
async def create_user_account(
    user_data: UserCreateModel,
    bg_tasks: BackgroundTasks,
    session: AsyncSession = Depends(get_session),
):
    """Create a new user account"""
    print('session', session)
    username = user_data.username
    user_exists = await user_service.get_user_by_username(username, session)

    if user_exists:
        raise UserAlreadyExists()
    
    new_user = await user_service.create_user(user_data, session)

    # token = create_url_safe_token({"username": username})

    # link = f"http://{Config.DOMAIN}/api/v1/auth/verify?token={token}"

    # html = f"""
    # <h1> verify your account </h1>
    # <p> click <a href="{link}">here</a> to verify your account </p>
    # """

    return {
        "message": "Account created successfully, please verify your account",
        "user": new_user
    }


@auth_router.post("/login", status_code=status.HTTP_200_OK)
async def login(
    login_data: LoginModel,
    session: AsyncSession = Depends(get_session),
):
    username = login_data.username
    password = login_data.password
    
    user = await user_service.get_user_by_username(username, session)

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


@auth_router.get("/verify/{token}")
async def verify_user_account(token: str, session: AsyncSession = Depends(get_session)):
    token_data = decode_url_safe_token(token)

    username = token_data.get('username')

    if username:
        user = await user_service.get_user_by_username(username, session)
        if not user:
            raise UserNotFound()
        
        await user_service.update_user(user, {"is_verified": True}, session)

        return JSONResponse(
            content={"message": "User verified successfully"},
            status_code=status.HTTP_200_OK,
        )

    return JSONResponse(
        content={"message": "Invalid token"},
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
    )

@auth_router.get("/refresh_token")
async def get_new_access_token(token_details: dict = Depends(RefreshTokenBearer)):
    expiry_timestamp = token_details["exp"]

    if (datetime.fromtimestamp(expiry_timestamp) > datetime.now()):
        new_access_token = create_access_token(user_data=token_details["user"])

        return JSONResponse(
            content={"access_token": new_access_token},
        )
    raise InvalidToken()

@auth_router.get("/logout")
async def revoke_token(token_details: dict = Depends(AccessTokenBearer)):
    jti = token_details["jti"]

    return JSONResponse(
        content={"message": "Logged Out successfully"},
        status_code=status.HTTP_200_OK,
    )

@auth_router.get("/users/", status_code=status.HTTP_200_OK, dependencies=[role_checker])
async def get_all_users(
    session: AsyncSession = Depends(get_session),
    _: dict = Depends(access_token_bearer),
):
    """Get all user accounts"""
    users = await user_service.get_all_users(session)
    return users

@auth_router.patch("/users/{user_id}/verify", status_code=status.HTTP_200_OK, dependencies=[role_checker])
async def toggle_user_verify(
    user_id: str,
    session: AsyncSession = Depends(get_session),
    _: dict = Depends(access_token_bearer),
):
    """Toggle user verification status"""
    try:
        user = await user_service.get_user_by_id(user_id, session)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        await user_service.update_user(user, {"is_verified": not user.is_verified}, session)
        return {"message": "User verification status updated successfully"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@auth_router.post("/change-password")
async def change_password(
    password_data: dict,
    session: AsyncSession = Depends(get_session),
    current_user: dict = Depends(access_token_bearer)
):
    """Change user password"""
    try:
        user_id = current_user.get("user")["uid"]
        current_password = password_data.get("current_password")
        new_password = password_data.get("new_password")
        
        # Verify current password
        user = await user_service.get_user_by_id(user_id, session)
        if not verify_password(current_password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Mật khẩu hiện tại không đúng"
            )
        
        # Update password
        hashed_password = get_password_hash(new_password)
        await user_service.update_password(user_id, hashed_password, session)
        
        return {"message": "Đổi mật khẩu thành công"}
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )