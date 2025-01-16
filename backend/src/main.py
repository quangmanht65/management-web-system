from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager

# Import routes
from auth.routes import auth_router
from employee.routes import employee_router
from department.routes import department_router
from position.routes import position_router
from education.routes import education_router
from payroll.routes import payroll_router
from attendance.routes import attendance_router

# Import utilities and config
from db.main import init_db
from middleware.middleware import register_middleware
from config import settings
from errors import register_all_errors, PayrollNotFound, AttendanceNotFound

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Starting up...")
    await init_db()
    yield
    print("Shutting down...")

version = "v1"

description = """
A rest api for Employee management
"""

version_prefix = f"/api/{version}"


app = FastAPI(
    title="Employee Management API",
    description=description,
    version=version,
    license_info={"name": "MIT license", "url": "https://opensource.org/license/mit"},
    contact={
        "name": "John Doe",
        "url": "https://www.johndoe.com",
        "email": "john.doe@example.com",
    },
    terms_of_service="https://example.com/tos",
    openapi_url=f"{version_prefix}/openapi.json",
    docs_url=f"{version_prefix}/docs",
    redoc_url=f"{version_prefix}/redoc",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=settings.CORS_ALLOW_CREDENTIALS,
    allow_methods=settings.CORS_ALLOW_METHODS,
    allow_headers=settings.CORS_ALLOW_HEADERS,
    expose_headers=["*"]
)

register_middleware(app)

register_all_errors(app)

app.include_router(auth_router, prefix=f"{version_prefix}/auth", tags=["auth"])

app.include_router(employee_router, prefix=f"{version_prefix}/employee", tags=["employee"])

app.include_router(department_router, prefix=f"{version_prefix}/department", tags=["department"])

app.include_router(position_router, prefix=f"{version_prefix}/position", tags=["position"])

app.include_router(education_router, prefix=f"{version_prefix}/education", tags=["education"])

app.include_router(payroll_router, prefix=f"{version_prefix}/payroll", tags=["payroll"])

app.include_router(attendance_router, prefix=f"{version_prefix}/attendance", tags=["attendance"])

@app.exception_handler(PayrollNotFound)
async def payroll_not_found_handler(request: Request, exc: PayrollNotFound):
    return JSONResponse(
        status_code=404,
        content={"message": "Payroll record not found"}
    )

@app.exception_handler(AttendanceNotFound)
async def attendance_not_found_handler(request: Request, exc: AttendanceNotFound):
    return JSONResponse(
        status_code=404,
        content={"message": "Attendance record not found"}
    )

