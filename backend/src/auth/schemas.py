import uuid
from datetime import datetime
from typing import List, Literal

from pydantic import BaseModel, Field

class LoginModel(BaseModel):
    username: str = Field(..., min_length=3, max_length=20)
    password: str = Field(..., min_length=8)

class UserCreateModel(BaseModel):
    username: str = Field(..., min_length=3, max_length=20)
    password: str = Field(..., min_length=8)
    role: Literal["user", "admin"] = Field(default="user")

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "username": "john_doe",
                    "password": "password123",
                    "role": "user"
                }   
            ]
        }
    }


class MailModel(BaseModel):
    addresses: List[str]