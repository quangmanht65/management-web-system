import uuid
from datetime import datetime
from typing import List

from pydantic import BaseModel, Field

class CustomerCreateModel(BaseModel):
    username: str = Field(..., min_length=3, max_length=20)
    email: str = Field(..., format="email")
    password: str = Field(..., min_length=8)

class LoginModel(BaseModel):
    username: str = Field(..., min_length=3, max_length=20)
    password: str = Field(..., min_length=8)

