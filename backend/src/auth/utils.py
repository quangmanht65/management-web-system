import logging
import uuid
from datetime import datetime, timedelta
from itsdangerous import URLSafeTimedSerializer

from config import settings

import jwt
from passlib.context import CryptContext

passwd_context = CryptContext(schemes=["bcrypt"])

def generate_password_hash(password: str) -> str:
    """Generate a password hash using bcrypt"""
    return passwd_context.hash(password)

# Alias for generate_password_hash to maintain compatibility
get_password_hash = generate_password_hash

def verify_password(password: str, hash: str) -> bool:
    """Verify a password against a hash"""
    return passwd_context.verify(password, hash)

def create_access_token(
    user_data: dict, 
    expiry: timedelta = None, 
    refresh: bool = False
) -> str:
    """
    Create a new JWT token with expiration time
    """
    expiration = int(settings.JWT_EXPIRATION) if not expiry else expiry.total_seconds()
    
    payload = {
        "user": user_data,
        "exp": datetime.utcnow() + timedelta(seconds=expiration),
        "jti": str(uuid.uuid4()),
        "refresh": refresh
    }

    token = jwt.encode(
        payload=payload,
        key=settings.JWT_SECRET,
        algorithm=settings.JWT_ALGORITHM
    )

    return token

def decode_token(token: str) -> dict:
    """
    Decode and verify a JWT token
    """
    try:
        decoded_token = jwt.decode(
            token, 
            settings.JWT_SECRET, 
            algorithms=[settings.JWT_ALGORITHM]
        )
        return decoded_token
    except jwt.ExpiredSignatureError:
        raise jwt.ExpiredSignatureError("Token has expired")
    except jwt.InvalidTokenError:
        raise jwt.InvalidTokenError("Invalid token")
    
serializer = URLSafeTimedSerializer(
    secret_key=settings.JWT_SECRET,
    salt="email-configuration"
)

def create_url_safe_token(data: dict):
    """Create a URL-safe token for email verification"""
    token = serializer.dumps(data)
    return token

def decode_url_safe_token(token: str):
    """Decode a URL-safe token"""
    try:
        token_data = serializer.loads(token)
        return token_data
    except Exception as e:
        logging.error(f"Error decoding URL-safe token: {str(e)}")
        return None
