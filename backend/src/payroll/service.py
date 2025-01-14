from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from typing import List
from datetime import datetime
from fastapi import HTTPException, status

from db.models import Payroll, Employee
from payroll.schemas import PayrollCreate, PayrollUpdate
from errors import PayrollNotFound, EmployeeNotFound

class PayrollService:
    async def create_payroll(self, payroll_data: PayrollCreate, user_id: str, session: AsyncSession) -> Payroll:
        """Create a new payroll record"""
        # Verify employee exists
        employee_exists = await session.get(Employee, payroll_data.employee_id)
        if not employee_exists:
            raise EmployeeNotFound()
        
        payroll_dict = payroll_data.model_dump()
        new_payroll = Payroll(**payroll_dict)
        
        session.add(new_payroll)
        await session.commit()
        await session.refresh(new_payroll)
        return new_payroll

    async def get_all_payrolls(self, session: AsyncSession) -> List[dict]:
        """Get all payroll records with employee names"""
        try:
            statement = (
                select(
                    Payroll,
                    Employee.full_name.label('employee_name')
                )
                .join(Employee, Payroll.employee_id == Employee.id)
            )
            
            result = await session.execute(statement)
            payrolls = []
            for payroll, employee_name in result:
                payroll_dict = payroll.__dict__
                if '_sa_instance_state' in payroll_dict:
                    del payroll_dict['_sa_instance_state']
                payroll_dict['employee_name'] = employee_name or 'N/A'
                payroll_dict['net_salary'] = payroll_dict['base_salary'] + payroll_dict['allowance'] - payroll_dict['deduction']
                payrolls.append(payroll_dict)
            return payrolls
        except Exception as e:
            print(f"Error getting payrolls: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to fetch payroll records"
            )

    async def get_payroll_by_id(self, payroll_id: int, session: AsyncSession) -> Payroll:
        """Get a specific payroll record"""
        statement = (
            select(Payroll, Employee.full_name.label('employee_name'))
            .outerjoin(Employee, Payroll.employee_id == Employee.id)
            .where(Payroll.id == payroll_id)
        )
        result = await session.execute(statement)
        payroll, employee_name = result.first()
        if not payroll:
            raise PayrollNotFound()
        
        payroll_dict = payroll.__dict__
        payroll_dict['employee_name'] = employee_name
        payroll_dict['net_salary'] = payroll_dict['base_salary'] + payroll_dict['allowance'] - payroll_dict['deduction']
        return payroll_dict

    async def update_payroll(self, payroll_id: int, payroll_data: PayrollUpdate, user_id: str, session: AsyncSession) -> Payroll:
        """Update a payroll record"""
        payroll = await session.get(Payroll, payroll_id)
        if not payroll:
            raise PayrollNotFound()
        
        # Update fields
        for field, value in payroll_data.model_dump(exclude_unset=True).items():
            setattr(payroll, field, value)
        
        payroll.updated_at = datetime.utcnow()
        session.add(payroll)
        await session.commit()
        await session.refresh(payroll)
        return payroll

    async def delete_payroll(self, payroll_id: int, user_id: str, session: AsyncSession) -> dict:
        """Delete a payroll record"""
        payroll = await session.get(Payroll, payroll_id)
        if not payroll:
            raise PayrollNotFound()
        
        await session.delete(payroll)
        await session.commit()
        return {"message": "Payroll record deleted successfully"} 