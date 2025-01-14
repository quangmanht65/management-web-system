from sqlmodel import select, func
from sqlmodel.ext.asyncio.session import AsyncSession
from typing import List
from db.models import Department, Employee
from department.schemas import DepartmentCreate, DepartmentUpdateModel
from errors import DepartmentNotFound
from fastapi import HTTPException, status

class DepartmentService:
    async def create_department(self, department_data: DepartmentCreate, user_id: str, session: AsyncSession) -> Department:
        """Create a new department"""
        department = Department(
            **department_data.model_dump()
        )
        
        session.add(department)
        await session.commit()
        await session.refresh(department)
        return department
    
    async def get_all_departments(self, session: AsyncSession) -> List[dict]:
        """Get all departments"""
        try:
            statement = (
                select(
                    Department,
                    func.count(Employee.id).label('employee_count')
                )
                .outerjoin(Employee, Department.id == Employee.department_id)
                .group_by(Department.id)
            )
            result = await session.execute(statement)
            departments = []
            for dept, count in result:
                dept_dict = dept.__dict__
                if '_sa_instance_state' in dept_dict:
                    del dept_dict['_sa_instance_state']
                dept_dict['employee_count'] = count
                departments.append(dept_dict)
            return departments
        except Exception as e:
            print(f"Error getting departments: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to fetch departments"
            )

    async def get_department_by_id(self, department_id: str, session: AsyncSession) -> Department:
        """Get department by ID"""
        statement = select(Department).where(Department.id == department_id)
        result = await session.execute(statement)
        return result.scalar_one_or_none()

    async def department_exists(self, department_id: str, session: AsyncSession) -> bool:
        """Check if department exists"""
        department = await self.get_department_by_id(department_id, session)
        return department is not None
    
    async def update_department(self, department_id: str, department_data: DepartmentUpdateModel, session: AsyncSession) -> Department:
        """Update a department"""
        department = await self.get_department_by_id(department_id, session)
        if not department:
            raise DepartmentNotFound()
        
        # Update only provided fields
        if department_data.DepartmentName is not None:
            department.DepartmentName = department_data.DepartmentName
        if department_data.Description is not None:
            department.Description = department_data.Description
        if department_data.Location is not None:
            department.Location = department_data.Location
        if department_data.PhoneNumber is not None:
            department.PhoneNumber = department_data.PhoneNumber

        session.add(department)
        await session.commit()
        await session.refresh(department)
        return department
    
    async def delete_department(self, department_id: str, session: AsyncSession) -> None:
        """Delete a department"""
        department = await self.get_department_by_id(department_id, session)
        if not department:
            raise DepartmentNotFound()
        
        await session.delete(department)
        await session.commit()

    async def get_count(self, session: AsyncSession) -> int:
        """Get total number of departments"""
        result = await session.execute(select(Department))
        departments = result.scalars().all()
        return len(departments)
    
    