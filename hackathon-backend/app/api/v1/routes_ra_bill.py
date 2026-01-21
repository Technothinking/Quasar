from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models.ra_bill import RABill
from app.schemas.ra_bill import RABillCreate, RABillResponse

router = APIRouter(prefix="/ra-bills", tags=["RA Bills"])


# Supervisor creates RA Bill (amount-based)
@router.post("/", response_model=RABillResponse)
def create_ra_bill(
    ra_in: RABillCreate,
    db: Session = Depends(get_db),
):
    supervisor_id = "supervisor_123"  # TEMP (auth later)

    ra_bill = RABill(
        ra_amount=ra_in.ra_amount,
        ra_bill_file=ra_in.ra_bill_file,
        status="UPLOADED",
        uploaded_by=supervisor_id,
    )

    db.add(ra_bill)
    db.commit()
    db.refresh(ra_bill)
    return ra_bill


# Manager views all pending RA Bills
@router.get("/pending", response_model=list[RABillResponse])
def list_pending_ra_bills(db: Session = Depends(get_db)):
    return (
        db.query(RABill)
        .filter(RABill.status == "UPLOADED")
        .all()
    )


# Manager reviews RA Bill
@router.post("/{ra_id}/review", response_model=RABillResponse)
def review_ra_bill(
    ra_id: int,
    db: Session = Depends(get_db),
):
    manager_id = "manager_123"  # TEMP (auth later)

    ra_bill = db.query(RABill).filter(RABill.id == ra_id).first()
    if not ra_bill:
        raise HTTPException(status_code=404, detail="RA Bill not found")

    ra_bill.status = "REVIEWED"
    ra_bill.reviewed_by = manager_id

    db.commit()
    db.refresh(ra_bill)
    return ra_bill
