from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from typing import List
from datetime import datetime, date
from fastapi import HTTPException, status

from db.models import Attendance, Employee, Department
from attendance.schemas import AttendanceCreate, AttendanceUpdate
from errors import AttendanceNotFound, EmployeeNotFound

class AttendanceService:
    async def create_or_update_attendance(
        self, attendance_data: AttendanceCreate, session: AsyncSession
    ) -> dict:
        """Create or update attendance record"""
        try:
            # Check if record exists for this employee and date
            statement = select(Attendance).where(
                Attendance.employee_id == attendance_data.employee_id,
                Attendance.date == attendance_data.date
            )
            result = await session.execute(statement)
            existing = result.scalar_one_or_none()

            if existing:
                # Update existing record
                existing.status = attendance_data.status
                existing.notes = attendance_data.notes
                existing.updated_at = datetime.utcnow()
                attendance = existing
            else:
                # Create new record
                attendance = Attendance(**attendance_data.model_dump())
                session.add(attendance)

            await session.commit()
            await session.refresh(attendance)

            # Get employee details
            employee = await session.get(Employee, attendance_data.employee_id)
            if not employee:
                raise EmployeeNotFound()

            # Get department name
            department = await session.get(Department, employee.department_id)
            
            return {
                **attendance.__dict__,
                'employee_name': employee.full_name,
                'employee_code': employee.employee_code,
                'department': department.name if department else None
            }

        except Exception as e:
            print(f"Error creating/updating attendance: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create/update attendance record"
            )

    async def get_attendance_by_date(
        self, date: date, session: AsyncSession
    ) -> List[dict]:
        """Get attendance records for a specific date"""
        try:
            statement = (
                select(
                    Attendance,
                    Employee.full_name,
                    Employee.employee_code,
                    Department.name.label('department_name')
                )
                .join(Employee, Attendance.employee_id == Employee.id)
                .outerjoin(Department, Employee.department_id == Department.id)
                .where(Attendance.date == date)
            )
            
            result = await session.execute(statement)
            attendance_records = []
            
            for record in result:
                attendance_dict = record[0].__dict__
                attendance_dict.update({
                    'employee_name': record[1],
                    'employee_code': record[2],
                    'department': record[3] or 'N/A'
                })
                attendance_records.append(attendance_dict)
                
            return attendance_records

        except Exception as e:
            print(f"Error getting attendance: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to fetch attendance records"
            ) 