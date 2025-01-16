class EmployeeNotFound(Exception):
    """Raised when employee is not found"""
    pass

class EmployeeAlreadyExists(Exception):
    """Raised when trying to create an employee that already exists"""
    pass

class ContractNotFound(Exception):
    """Raised when contract is not found"""
    pass 