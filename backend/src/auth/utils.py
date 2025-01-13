import logging
import uuid
from datetime import datetime, timedelta
from itsdangerous import URLSafeTimedSerializer

from config import Config

import jwt
from passlib.context import CryptContext

ACCESS_TOKEN_EXPIRY = 3600
passwd_context = CryptContext(schemes=["bcrypt"])


def generate_password_hash(password: str) -> str:
    hash = passwd_context.hash(password)

    return hash

def verify_password(password: str, hash: str) -> bool:
    return passwd_context.verify(password, hash)


def create_access_token(
    user_data: dict, 
    expiry: timedelta = None, 
    refresh: bool = False
) -> str:
    payload = {
        "user": user_data,
        "exp": datetime.now() + (expiry or timedelta(seconds=ACCESS_TOKEN_EXPIRY)),
        "jti": str(uuid.uuid4()),
        "refresh": refresh
    }

    token = jwt.encode(
        payload=payload,
        key=Config.JWT_SECRET,
        algorithm=Config.JWT_ALGORITHM
    )

    return token

def decode_token(token: str) -> dict:
    try:
        token_data = jwt.decode(token, key=Config.JWT_SECRET, algorithms=[Config.JWT_ALGORITHM])
        return token_data
    except jwt.PyJWKError as e:
        logging.exception(e)
        return None
    
serializer = URLSafeTimedSerializer(
    secret_key=Config.JWT_SECRET,
    salt="email-configuration"
)

def create_url_safe_token(data: dict):
    token = serializer.dumps(data)

    return token

def decode_url_safe_token(token: str):
    try:
        token_data = serializer.loads(token)

        return token_data
    except Exception as e:
        logging.error(e)    
