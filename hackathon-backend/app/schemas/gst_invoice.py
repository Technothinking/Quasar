from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional


# Used when Manager generates GST invoice from RA Bill
class GSTInvoiceCreate(BaseModel):
    ra_bill_id: int

    # Seller (Owner)
    seller_name: str
    seller_gstin: str
    seller_address: str

    # Buyer (Client)
    client_name: str
    client_gstin: str
    place_of_supply: str

    # Deductions
    previous_ra_deductions: float = 0
    retention_amount: float = 0


# Returned to Manager / Owner
class GSTInvoiceResponse(BaseModel):
    id: int
    ra_bill_id: int

    invoice_no: str
    invoice_date: date

    seller_name: str
    seller_gstin: str
    seller_address: str

    client_name: str
    client_gstin: str
    place_of_supply: str

    gross_ra_amount: float
    previous_ra_deductions: float
    retention_amount: float
    taxable_amount: float

    cgst_rate: float
    sgst_rate: float
    igst_rate: float

    cgst_amount: float
    sgst_amount: float
    igst_amount: float

    grand_total: float
    amount_in_words: str

    status: str
    created_at: datetime

    class Config:
        from_attributes = True
