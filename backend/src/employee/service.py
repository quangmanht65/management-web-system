from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from typing import List, Optional
from datetime import datetime
from fastapi import HTTPException, status

from db.models import Employee, Position, Department, Contract
from employee.schemas import EmployeeCreate, EmployeeUpdateModel, ContractCreate, ContractUpdate
from errors.employee_errors import EmployeeNotFound, ContractNotFound

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

    async def create_contract(self, contract_data: ContractCreate, user_id: str, session: AsyncSession) -> dict:
        """Create a new contract for an employee"""
        try:
            # Verify employee exists
            employee = await session.get(Employee, contract_data.employee_id)
            if not employee:
                raise EmployeeNotFound()

            contract_data_dict = contract_data.model_dump()
            new_contract = Contract(**contract_data_dict)
            
            session.add(new_contract)
            await session.commit()
            await session.refresh(new_contract)

            # Convert to dict and add employee name
            result_dict = new_contract.__dict__
            if '_sa_instance_state' in result_dict:
                del result_dict['_sa_instance_state']
            result_dict['employee_name'] = employee.full_name
            
            return result_dict

        except Exception as e:
            print(f"Error creating contract: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create contract"
            )

    async def get_employee_contracts(self, employee_id: str, session: AsyncSession) -> List[Contract]:
        """Get all contracts for an employee"""
        statement = select(Contract).where(Contract.employee_id == employee_id)
        result = await session.execute(statement)
        contracts = result.scalars().all()
        return list(contracts)

    async def get_contract_by_id(self, contract_id: int, session: AsyncSession) -> Contract:
        """Get a specific contract by ID"""
        statement = select(Contract).where(Contract.id == contract_id)
        result = await session.execute(statement)
        contract = result.scalar_one_or_none()
        if not contract:
            raise ContractNotFound()
        return contract

    async def update_contract(
        self, contract_id: int, contract_data: ContractUpdate, session: AsyncSession
    ) -> Contract:
        """Update a contract"""
        contract = await self.get_contract_by_id(contract_id, session)
        
        # Update fields
        for field, value in contract_data.model_dump(exclude_unset=True).items():
            setattr(contract, field, value)
        
        contract.updated_at = datetime.utcnow()
        session.add(contract)
        await session.commit()
        await session.refresh(contract)
        return contract

    async def delete_contract(self, contract_id: int, session: AsyncSession) -> dict:
        """Delete a contract"""
        contract = await self.get_contract_by_id(contract_id, session)
        
        await session.delete(contract)
        await session.commit()
        return {"message": "Contract deleted successfully"}
    
    async def get_all_contracts(self, session: AsyncSession) -> List[Contract]:
        """Get all contracts"""
        statement = (
            select(
                Contract,
                Employee.full_name.label('employee_name')
            )
            .outerjoin(Employee, Contract.employee_id == Employee.id)
        )
        result = await session.execute(statement)
        contracts = []
        for contract, employee_name in result:
            contract_dict = contract.__dict__
            if '_sa_instance_state' in contract_dict:
                del contract_dict['_sa_instance_state']
            contract_dict['employee_name'] = employee_name or 'N/A'
            contracts.append(contract_dict)
        return contracts
