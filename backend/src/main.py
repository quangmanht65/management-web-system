from fastapi import FastAPI
from auth.routes import auth_router
from db.main import init_db
from middleware import register_middleware
from errors import register_all_errors
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Starting up...")
    await init_db()
    yield
    print("Shutting down...")

version = "v1"

description = """
A rest api for customer management
"""

version_prefix = f"/api/{version}"


app = FastAPI(
    title="Customer Management API",
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

register_middleware(app)

register_all_errors(app)

app.include_router(auth_router, prefix=f"{version_prefix}/auth", tags=["auth"])

@app.get("/")
async def root():
    return {"message": "Hello World"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=2002)