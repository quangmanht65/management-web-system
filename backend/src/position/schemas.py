from pydantic import BaseModel, Field

class PositionCreate(BaseModel):
    position_code: str = Field(..., min_length=1, max_length=8)
    title: str = Field(..., min_length=1, max_length=50)

class PositionRead(BaseModel):
    id: int
    position_code: str
    title: str

class PositionUpdate(BaseModel):
    title: str = Field(..., min_length=1, max_length=50) 