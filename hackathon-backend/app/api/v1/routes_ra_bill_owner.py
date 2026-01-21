from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models.ra_bill import RABill
from app.schemas.ra_bill import RABillResponse

router = APIRouter(
    prefix="/owner/ra-bills",
    tags=["Owner RA Bills"]
)


# Owner: view approved RA Bills
@router.get("/", response_model=list[RABillResponse])
def list_owner_ra_bills(db: Session = Depends(get_db)):
    return (
        db.query(RABill)
        .filter(RABill.status.in_(["REVIEWED", "GST_GENERATED"]))
        .order_by(RABill.created_at.desc())
        .all()
    )


# Owner: view single RA Bill
@router.get("/{ra_bill_id}", response_model=RABillResponse)
def get_owner_ra_bill(ra_bill_id: int, db: Session = Depends(get_db)):
    ra_bill = (
        db.query(RABill)
        .filter(
            RABill.id == ra_bill_id,
            RABill.status.in_(["REVIEWED", "GST_GENERATED"])
        )
        .first()
    )
    return ra_bill
