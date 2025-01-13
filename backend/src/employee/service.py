from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from typing import List

from db.models import Employee
from employee.schemas import EmployeeCreate, EmployeeUpdateModel
from errors import EmployeeNotFound

class EmployeeService:
    async def create_employee(self, employee_data: EmployeeCreate, session: AsyncSession) -> Employee:
        """Create a new employee"""
        employee = Employee(
            EmployeeID=employee_data.EmployeeID,
            PositionID=employee_data.PositionID,
            DepartmentID=employee_data.DepartmentID,
            Salary=employee_data.Salary,
            Gender=employee_data.Gender,
            ContractID=employee_data.ContractID,
            EmployeeName=employee_data.EmployeeName,
            DateOfBirth=employee_data.DateOfBirth,
            PlaceOfBirth=employee_data.PlaceOfBirth,
            IDNumber=employee_data.IDNumber,
            Phone=employee_data.Phone,
            Address=employee_data.Address,
            Email=employee_data.Email,
            MaritalStatus=employee_data.MaritalStatus,
            Ethnicity=employee_data.Ethnicity,
            EducationLevelID=employee_data.EducationLevelID,
            IDCardDate=employee_data.IDCardDate,
            IDCardPlace=employee_data.IDCardPlace,
            HealthInsurance=employee_data.HealthInsurance,
            SocialInsurance=employee_data.SocialInsurance,
            ID_profile_image=employee_data.ID_profile_image
        )
        
        session.add(employee)
        await session.commit()
        await session.refresh(employee)
        return employee
    
    async def get_all_employees(self, session: AsyncSession) -> List[Employee]:
        """Get all employees"""
        statement = select(Employee)
        result = await session.execute(statement)
        return result.scalars().all()

    async def get_employee_by_id(self, employee_id: str, session: AsyncSession) -> Employee:
        """Get employee by ID"""
        statement = select(Employee).where(Employee.EmployeeID == employee_id)
        result = await session.execute(statement)
        return result.scalar_one_or_none()

    async def employee_exists(self, employee_id: str, session: AsyncSession) -> bool:
        """Check if employee exists"""
        employee = await self.get_employee_by_id(employee_id, session)
        return employee is not None 
    
    async def update_employee(self, employee_id: str, employee_data: EmployeeUpdateModel, session: AsyncSession) -> Employee:
        """Update an employee"""
        employee = await self.get_employee_by_id(employee_id, session)
        if not employee:
            raise EmployeeNotFound()
        
        employee.EmployeeName = employee_data.EmployeeName
        employee.DateOfBirth = employee_data.DateOfBirth
        employee.PlaceOfBirth = employee_data.PlaceOfBirth
        employee.IDNumber = employee_data.IDNumber
        employee.Phone = employee_data.Phone
        employee.Address = employee_data.Address
        employee.Email = employee_data.Email
        employee.MaritalStatus = employee_data.MaritalStatus
        employee.Ethnicity = employee_data.Ethnicity
        employee.EducationLevelID = employee_data.EducationLevelID
        employee.IDCardDate = employee_data.IDCardDate
        employee.IDCardPlace = employee_data.IDCardPlace
        employee.HealthInsurance = employee_data.HealthInsurance
        employee.SocialInsurance = employee_data.SocialInsurance
        employee.ID_profile_image = employee_data.ID_profile_image

        session.add(employee)
        await session.commit()
        await session.refresh(employee)
        return employee
    
    async def delete_employee(self, employee_id: str, session: AsyncSession) -> None:
        """Delete an employee"""
        employee = await self.get_employee_by_id(employee_id, session)
        if not employee:
            raise EmployeeNotFound()
        
        await session.delete(employee)
        await session.commit()