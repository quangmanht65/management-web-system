from fastapi import APIRouter, Depends, HTTPException, Body
from sqlmodel.ext.asyncio.session import AsyncSession
from typing import List
from db.main import get_session
from education.service import EducationService
from education.schemas import EducationResponse, EducationCreate

education_router = APIRouter()
education_service = EducationService()

@education_router.get("/", response_model=List[EducationResponse])
async def get_all_education(
    session: AsyncSession = Depends(get_session)
):
    """Get all education records"""
    try:
        education = await education_service.get_all_education(session)
        return education
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@education_router.get("/{employee_id}", response_model=List[EducationResponse])
async def get_employee_education(
    employee_id: int,
    session: AsyncSession = Depends(get_session)
):
    """Get all education records for an employee"""
    try:
        education = await education_service.get_employee_education(employee_id, session)
        return education
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@education_router.post("/{employee_id}", response_model=EducationResponse)
async def create_employee_education(
    employee_id: int,
    education: EducationCreate,
    session: AsyncSession = Depends(get_session)
):
    """Create a new education record for an employee"""
    try:
        education_data = education
        print(education_data)
        new_education = await education_service.create_education(education_data, session)
        return new_education
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@education_router.delete("/{education_id}")
async def delete_education(
    education_id: int,
    session: AsyncSession = Depends(get_session)
):
    """Delete an education record"""
    try:
        await education_service.delete_education(education_id, session)
        return {"message": "Education record deleted successfully"}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@education_router.put("/{education_id}", response_model=EducationResponse)
async def update_education(
    education_id: int,
    education: EducationCreate,
    session: AsyncSession = Depends(get_session)
):
    """Update an education record"""
    try:
        updated_education = await education_service.update_education(
            education_id, education, session
        )
        return updated_education
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@education_router.post("/import", response_model=List[EducationResponse])
async def import_education(
    education_list: List[EducationCreate] = Body(...),
    session: AsyncSession = Depends(get_session)
):
    """Import multiple education records"""
    try:
        imported_records = await education_service.import_education(education_list, session)
        return imported_records
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 