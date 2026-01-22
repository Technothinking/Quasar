from pydantic import BaseModel
from typing import Optional


class MaterialStockCreate(BaseModel):
    project_id: int
    material_name: str
    unit: str
    current_quantity: float

class MaterialStockUpdate(BaseModel):
    current_quantity: Optional[float] = None
    unit: Optional[str] = None

class MaterialStockResponse(MaterialStockCreate):
    id: int

    class Config:
        from_attributes = True
