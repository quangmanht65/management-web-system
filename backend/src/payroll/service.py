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
        try:
            # Verify employee exists
            employee = await session.get(Employee, payroll_data.employee_id)
            if not employee:
                raise EmployeeNotFound()

            payroll_dict = payroll_data.model_dump()
            new_payroll = Payroll(**payroll_dict)
            
            session.add(new_payroll)
            await session.commit()
            await session.refresh(new_payroll)

            # Convert to dict and add required fields
            result_dict = new_payroll.__dict__
            if '_sa_instance_state' in result_dict:
                del result_dict['_sa_instance_state']
            result_dict['employee_name'] = employee.full_name
            result_dict['net_salary'] = new_payroll.base_salary + new_payroll.allowance - new_payroll.deduction
            
            return result_dict

        except Exception as e:
            print(f"Error creating payroll: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create payroll record"
            )

    async def get_all_payrolls(self, session: AsyncSession, user_id: str) -> List[dict]:
        """Get all payroll records with employee names"""
        try:
            statement = (
                select(
                    Payroll,
                    Employee.full_name.label('employee_name')
                )
                .join(Employee, Payroll.employee_id == Employee.id)
            )

            print("statement: ", statement)
            
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
            if field != 'employee_name':
                setattr(payroll, field, value)
        
        payroll.updated_at = datetime.utcnow()
        session.add(payroll)
        await session.commit()
        await session.refresh(payroll)
        
        result_dict = payroll.__dict__
        if '_sa_instance_state' in result_dict:
            del result_dict['_sa_instance_state']
        result_dict['employee_name'] = payroll_data.employee_name
        result_dict['net_salary'] = result_dict['base_salary'] + result_dict['allowance'] - result_dict['deduction']
        
        return result_dict

    async def delete_payroll(self, payroll_id: int, user_id: str, session: AsyncSession) -> dict:
        """Delete a payroll record"""
        payroll = await session.get(Payroll, payroll_id)
        if not payroll:
            raise PayrollNotFound()
        
        await session.delete(payroll)
        await session.commit()
        return {"message": "Payroll record deleted successfully"} 