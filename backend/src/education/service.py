from sqlmodel import select, and_
from sqlmodel.ext.asyncio.session import AsyncSession
from typing import List
from db.models import Education
from education.schemas import EducationCreate

class EducationService:
    async def get_all_education(self, session: AsyncSession) -> List[Education]:
        """Get all education records"""
        statement = select(Education)
        result = await session.execute(statement)
        education = result.scalars().all()
        return list(education)

    async def get_employee_education(self, employee_id: int, session: AsyncSession) -> List[Education]:
        """Get all education records for an employee"""
        statement = select(Education).where(Education.employee_id == employee_id)
        result = await session.execute(statement)
        education = result.scalars().all()
        return list(education)

    async def create_education(self, education: EducationCreate, session: AsyncSession) -> Education:
        """Create a new education record"""
        db_education = Education(
            degree_name=education.degree_name,
            school=education.school,
            major=education.major,
            graduation_year=education.graduation_year,
            ranking=education.ranking,
            employee_id=education.employee_id
        )
        session.add(db_education)
        await session.commit()
        await session.refresh(db_education)
        return db_education

    async def delete_education(self, employee_id: int, education_id: int, session: AsyncSession) -> None:
        """Delete an education record"""
        statement = select(Education).where(
            and_(
                Education.id == education_id,
                Education.employee_id == employee_id
            )
        )
        result = await session.execute(statement)
        education = result.scalar_one_or_none()
        
        if not education:
            raise ValueError("Education record not found")
        
        await session.delete(education)
        await session.commit()

    async def update_education(
        self, 
        employee_id: int, 
        education_id: int, 
        education: EducationCreate, 
        session: AsyncSession
    ) -> Education:
        """Update an education record"""
        statement = select(Education).where(
            and_(
                Education.id == education_id,
                Education.employee_id == employee_id
            )
        )
        result = await session.execute(statement)
        db_education = result.scalar_one_or_none()
        
        if not db_education:
            raise ValueError("Education record not found")
        
        education_data = education.model_dump(exclude_unset=True)
        for key, value in education_data.items():
            setattr(db_education, key, value)
        
        await session.commit()
        await session.refresh(db_education)
        return db_education 

    async def import_education(
        self, 
        education_list: List[EducationCreate], 
        session: AsyncSession
    ) -> List[Education]:
        """Import multiple education records"""
        imported_records = []
        for education_data in education_list:
            db_education = Education(**education_data.model_dump())
            session.add(db_education)
            imported_records.append(db_education)
        
        await session.commit()
        for record in imported_records:
            await session.refresh(record)
        
        return imported_records 