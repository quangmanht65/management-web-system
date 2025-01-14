from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from typing import List, Optional

from db.models import Employee, Position, Department
from employee.schemas import EmployeeCreate, EmployeeUpdateModel
from errors import EmployeeNotFound

class EmployeeService:
    async def create_employee(self, employee_data: EmployeeCreate, uid: str, session: AsyncSession) -> Employee:
        """Create a new employee"""
        employee_data_dict = employee_data.model_dump()
        
        new_employee = Employee(
            **employee_data_dict
        )

        session.add(new_employee)
        await session.commit()
        await session.refresh(new_employee)
        return new_employee
    
    async def get_all_employees(self, session: AsyncSession) -> List[dict]:
        """Get all employees with their position and department"""
        statement = (
            select(
                Employee,
                Position.title,
                Department.name,
            )
            .outerjoin(Position, Employee.position_id == Position.id)
            .outerjoin(Department, Employee.department_id == Department.id)
        )
        
        result = await session.execute(statement)
        employees = []
        
        for emp, position_name, dept_name in result:
            emp_dict = emp.dict()
            emp_dict.update({
                'Position': position_name or 'N/A',
                'Department': dept_name or 'N/A'
            })
            employees.append(emp_dict)
            
        return employees

    async def get_employee_by_id(self, employee_id: str, session: AsyncSession) -> Optional[Employee]:
        """Get employee by ID"""
        print("employee_id: ", employee_id)
        statement = select(Employee).where(Employee.id == employee_id)
        result = await session.execute(statement)
        employee = result.scalar_one_or_none()
        if not employee:
            raise EmployeeNotFound()
        return employee

    async def employee_exists(self, employee_id: str, session: AsyncSession) -> bool:
        """Check if employee exists"""
        statement = select(Employee).where(Employee.id == employee_id)
        result = await session.execute(statement)
        return result.scalar_one_or_none() is not None
    
    async def update_employee(self, employee_id: str, employee_data: EmployeeUpdateModel, session: AsyncSession) -> Employee:
        """Update an employee"""
        employee = await self.get_employee_by_id(employee_id, session)
        if not employee:
            raise EmployeeNotFound()
        
        # Update fields
        for field, value in employee_data.model_dump(exclude_unset=True).items():
            setattr(employee, field, value)

        session.add(employee)
        await session.commit()
        await session.refresh(employee)
        return employee
    
    async def delete_employee(self, employee_id: str, session: AsyncSession) -> dict:
        """Delete an employee"""
        employee = await self.get_employee_by_id(employee_id, session)
        if not employee:
            raise EmployeeNotFound()
        
        await session.delete(employee)
        await session.commit()
        return {"message": "Employee deleted successfully"}

    async def get_count(self, user_id: str, session: AsyncSession) -> dict:
        """Get total number of employees"""
        result = await session.execute(select(Employee))
        employees = result.scalars().all()
        return {"count": len(list(employees))}