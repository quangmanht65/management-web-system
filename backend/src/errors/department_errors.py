class DepartmentNotFound(Exception):
    """Raised when department is not found"""
    pass

class DepartmentAlreadyExists(Exception):
    """Raised when trying to create a department that already exists"""
    pass 