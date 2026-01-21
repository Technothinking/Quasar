from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class RABillCreate(BaseModel):
    ra_amount: float
    ra_bill_file: Optional[str] = None


class RABillResponse(BaseModel):
    id: int
    ra_amount: float
    ra_bill_file: Optional[str]
    status: str
    uploaded_by: str
    reviewed_by: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True
