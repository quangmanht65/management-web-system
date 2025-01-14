from typing import Any, Callable
from fastapi.requests import Request
from fastapi.responses import JSONResponse
from fastapi import FastAPI, status, HTTPException
from mysql.connector import Error

class UserException(Exception):
    """This is a base class for all user exceptions"""
    pass

class UserNotFound(UserException):
    """User not found"""
    pass

class UserAlreadyExists(UserException):
    """User already exists"""
    pass

class InvalidCredentials(UserException):
    """User has provided wrong email or password during log in."""

    pass

class InvalidToken(UserException):
    """Invalid token"""
    pass

class RefreshTokenRequired(UserException):
    """Refresh token is required"""
    pass

class AccessTokenRequired(UserException):
    """Access token is required"""
    pass

class EmployeeAlreadyExists(Exception):
    """Employee with this ID already exists"""
    pass

class InsufficientPermission(Exception):
    """Insufficient permission"""
    pass

class AccountNotVerified(Exception):
    """Account not verified"""
    pass

class EmployeeNotFound(Exception):
    """Employee not found"""
    pass

class DepartmentNotFound(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Department not found"
        )

class DepartmentAlreadyExists(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_409_CONFLICT,
            detail="Department already exists"
        )

class PositionNotFound(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Position not found"
        )

class PositionAlreadyExists(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_409_CONFLICT,
            detail="Position already exists"
        )

class ContractNotFound(Exception):
    def __init__(self):
        self.message = "Contract not found"
        super().__init__(self.message)

class PayrollNotFound(Exception):
    def __init__(self):
        self.message = "Payroll record not found"
        super().__init__(self.message)

def create_exception_handler(
    status_code: int, initial_detail: Any
) -> Callable[[Request, Exception], JSONResponse]:
    
    async def exception_handler(request: Request, exc: UserException):
    
        return JSONResponse(content=initial_detail, status_code=status_code)
    
    return exception_handler

def register_all_errors(app: FastAPI):
    app.add_exception_handler(
        UserNotFound,
        create_exception_handler(
            status_code=status.HTTP_404_NOT_FOUND,
            initial_detail={
                "message": "User not found",
                "error_code": "user_not_found",
            }
        )
    )

    app.add_exception_handler(
        InvalidCredentials,
        create_exception_handler(
            status_code=status.HTTP_401_UNAUTHORIZED,
            initial_detail={
                "message": "Invalid credentials",
                "error_code": "invalid_credentials",
            }
        )
    )

    @app.exception_handler(500)
    async def internal_server_error(request, exc):
        return JSONResponse(
            content={
                "message": "Oops! Something went wrong",
                "error_code": "server_error",
            },
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
    
    @app.exception_handler(Error)
    async def database_error(request, exc):
        print(str(exc))
        return JSONResponse(
            content={
                "message": "Oops! Something went wrong",
                "error_code": "server_error",
            },
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )