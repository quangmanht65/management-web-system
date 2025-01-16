from .auth_errors import (
    InvalidCredentials, 
    UserAlreadyExists, 
    UserNotFound, 
    InvalidToken,
    RefreshTokenRequired
)
from .payroll_errors import PayrollNotFound
from .attendance_errors import AttendanceNotFound
from .employee_errors import (
    EmployeeNotFound, 
    EmployeeAlreadyExists,
    ContractNotFound
)
from .department_errors import (
    DepartmentNotFound,
    DepartmentAlreadyExists
)
from .position_errors import (
    PositionNotFound,
    PositionAlreadyExists
)

__all__ = [
    'InvalidCredentials',
    'UserAlreadyExists',
    'UserNotFound',
    'InvalidToken',
    'RefreshTokenRequired',
    'PayrollNotFound',
    'AttendanceNotFound',
    'EmployeeNotFound',
    'EmployeeAlreadyExists',
    'ContractNotFound',
    'DepartmentNotFound',
    'DepartmentAlreadyExists',
    'PositionNotFound',
    'PositionAlreadyExists'
]

def register_all_errors(app):
    # Register error handlers here if needed
    pass
