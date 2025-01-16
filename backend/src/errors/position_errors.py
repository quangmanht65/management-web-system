class PositionNotFound(Exception):
    """Raised when position is not found"""
    pass

class PositionAlreadyExists(Exception):
    """Raised when trying to create a position that already exists"""
    pass 