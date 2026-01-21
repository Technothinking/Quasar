from sqlalchemy import Column, Integer, Numeric, String, Date, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.db.base import Base


class GSTInvoice(Base):
    __tablename__ = "gst_invoices"

    id = Column(Integer, primary_key=True)

    # Link to RA Bill
    ra_bill_id = Column(Integer, ForeignKey("ra_bills.id"), nullable=False)

    # Invoice identity
    invoice_no = Column(String, nullable=False, unique=True)
    invoice_date = Column(Date, nullable=False)

    # Seller (Owner)
    seller_name = Column(String, nullable=False)
    seller_gstin = Column(String, nullable=False)
    seller_address = Column(String, nullable=False)

    # Buyer (Client)
    client_name = Column(String, nullable=False)
    client_gstin = Column(String, nullable=False)
    place_of_supply = Column(String, nullable=False)

    # Amounts
    gross_ra_amount = Column(Numeric(12, 2), nullable=False)
    previous_ra_deductions = Column(Numeric(12, 2), nullable=False, default=0)
    retention_amount = Column(Numeric(12, 2), nullable=False, default=0)
    taxable_amount = Column(Numeric(12, 2), nullable=False)

    # Tax rates
    cgst_rate = Column(Numeric(5, 2), nullable=False, default=9.00)
    sgst_rate = Column(Numeric(5, 2), nullable=False, default=9.00)
    igst_rate = Column(Numeric(5, 2), nullable=False, default=0.00)

    # Tax amounts
    cgst_amount = Column(Numeric(12, 2), nullable=False, default=0)
    sgst_amount = Column(Numeric(12, 2), nullable=False, default=0)
    igst_amount = Column(Numeric(12, 2), nullable=False, default=0)

    # Final
    grand_total = Column(Numeric(12, 2), nullable=False)
    amount_in_words = Column(String, nullable=False)

    status = Column(String, nullable=False, default="GENERATED")

    created_at = Column(DateTime, server_default=func.now())
