from pydantic import BaseModel

class MaterialRequestCreate(BaseModel):
    project_id: int
    material_name: str
    unit: str
    quantity_requested: float


class MaterialRequestApprove(BaseModel):
    status: str            # approved / rejected
    

class MaterialRequestResponse(BaseModel):
    id: int
    project_id: int
    material_name: str
    unit: str
    quantity_requested: float
    status: str

    class Config:
        from_attributes = True
