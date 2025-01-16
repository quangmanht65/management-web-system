class InvalidCredentials(Exception):
    """Raised when credentials are invalid"""
    pass

class UserAlreadyExists(Exception):
    """Raised when trying to create a user that already exists"""
    pass

class UserNotFound(Exception):
    """Raised when user is not found"""
    pass

class InvalidToken(Exception):
    """Raised when token is invalid"""
    pass

class RefreshTokenRequired(Exception):
    """Raised when refresh token is required but not provided"""
    pass 