from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
import time
import logging

logger = logging.getLogger(__name__)

async def request_middleware(request: Request, call_next):
    """Log request timing and details"""
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    
    logger.info(
        f"Method: {request.method} Path: {request.url.path} "
        f"Status: {response.status_code} Time: {process_time:.2f}s"
    )
    
    return response

def register_middleware(app: FastAPI):
    """Register all middleware"""
    
    @app.middleware("http")
    async def log_requests(request: Request, call_next) -> Response:
        return await request_middleware(request, call_next)

    # Add other middleware registration here if needed 