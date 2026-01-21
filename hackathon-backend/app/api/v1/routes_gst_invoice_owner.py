from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models.gst_invoice import GSTInvoice
from app.schemas.gst_invoice import GSTInvoiceResponse

router = APIRouter(prefix="/owner/gst-invoices", tags=["Owner GST View"])


# Owner: view all GST invoices
@router.get("/", response_model=list[GSTInvoiceResponse])
def list_gst_invoices(db: Session = Depends(get_db)):
    invoices = db.query(GSTInvoice).order_by(GSTInvoice.created_at.desc()).all()
    return invoices


# Owner: view single GST invoice
@router.get("/{invoice_id}", response_model=GSTInvoiceResponse)
def get_gst_invoice(invoice_id: int, db: Session = Depends(get_db)):
    invoice = db.query(GSTInvoice).filter(GSTInvoice.id == invoice_id).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="GST Invoice not found")
    return invoice
