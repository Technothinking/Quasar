from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date

from app.api.deps import get_db
from app.models.ra_bill import RABill
from app.models.gst_invoice import GSTInvoice
from app.schemas.gst_invoice import GSTInvoiceCreate, GSTInvoiceResponse

router = APIRouter(prefix="/gst-invoices", tags=["GST Invoices"])


def amount_in_words(amount: float) -> str:
    # SIMPLE placeholder (good for prototype)
    return f"Rupees {int(amount)} Only"


@router.post("/", response_model=GSTInvoiceResponse)
def generate_gst_invoice(
    gst_in: GSTInvoiceCreate,
    db: Session = Depends(get_db),
):
    manager_id = "manager_123"  # TEMP (auth later)

    # 1. Fetch RA Bill
    ra_bill = db.query(RABill).filter(RABill.id == gst_in.ra_bill_id).first()
    if not ra_bill:
        raise HTTPException(status_code=404, detail="RA Bill not found")

    if ra_bill.status != "REVIEWED":
        raise HTTPException(
            status_code=400,
            detail="RA Bill must be REVIEWED before GST generation"
        )

    # 2. Amount calculations
    gross_amount = float(ra_bill.ra_amount)
    taxable_amount = (
        gross_amount
        - gst_in.previous_ra_deductions
        - gst_in.retention_amount
    )

    if taxable_amount < 0:
        raise HTTPException(
            status_code=400,
            detail="Taxable amount cannot be negative"
        )

    # 3. Tax logic (same state vs different state)
    same_state = True  # TEMP: later compare GSTIN state codes

    if same_state:
        cgst_rate = 9.0
        sgst_rate = 9.0
        igst_rate = 0.0

        cgst_amount = taxable_amount * 0.09
        sgst_amount = taxable_amount * 0.09
        igst_amount = 0.0
    else:
        cgst_rate = 0.0
        sgst_rate = 0.0
        igst_rate = 18.0

        cgst_amount = 0.0
        sgst_amount = 0.0
        igst_amount = taxable_amount * 0.18

    grand_total = taxable_amount + cgst_amount + sgst_amount + igst_amount

    # 4. Create invoice
    invoice = GSTInvoice(
        ra_bill_id=ra_bill.id,
        invoice_no=f"GST-{ra_bill.id}-{date.today().year}",
        invoice_date=date.today(),

        seller_name=gst_in.seller_name,
        seller_gstin=gst_in.seller_gstin,
        seller_address=gst_in.seller_address,

        client_name=gst_in.client_name,
        client_gstin=gst_in.client_gstin,
        place_of_supply=gst_in.place_of_supply,

        gross_ra_amount=gross_amount,
        previous_ra_deductions=gst_in.previous_ra_deductions,
        retention_amount=gst_in.retention_amount,
        taxable_amount=taxable_amount,

        cgst_rate=cgst_rate,
        sgst_rate=sgst_rate,
        igst_rate=igst_rate,

        cgst_amount=cgst_amount,
        sgst_amount=sgst_amount,
        igst_amount=igst_amount,

        grand_total=grand_total,
        amount_in_words=amount_in_words(grand_total),

        status="GENERATED",
    )

    db.add(invoice)

    # 5. Lock RA Bill
    ra_bill.status = "GST_GENERATED"

    db.commit()
    db.refresh(invoice)

    return invoice
