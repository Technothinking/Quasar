from sqlalchemy import Column, Integer, Numeric, String, DateTime
from sqlalchemy.sql import func
from app.db.base import Base


class RABill(Base):
    __tablename__ = "ra_bills"

    id = Column(Integer, primary_key=True)
    ra_amount = Column(Numeric(12, 2), nullable=False)

    # placeholder only, no upload logic
    ra_bill_file = Column(String, nullable=True)

    status = Column(String, nullable=False, default="UPLOADED")
    uploaded_by = Column(String, nullable=False)
    reviewed_by = Column(String, nullable=True)

    created_at = Column(DateTime, server_default=func.now())
