from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from app.api.deps import get_db
from app.models.material_request import MaterialRequest
from app.schemas.material_request import (
    MaterialRequestCreate,
    MaterialRequestApprove,
    MaterialRequestResponse
)

router = APIRouter(prefix="/material-requests", tags=["Material Requests"])

@router.post("/", response_model=MaterialRequestResponse)
def create_request(payload: MaterialRequestCreate, db: Session = Depends(get_db)):
    request = MaterialRequest(
        **payload.dict()
    )
    db.add(request)
    db.commit()
    db.refresh(request)
    return request

@router.patch("/{request_id}", response_model=MaterialRequestResponse)
def approve_or_reject_request(
    request_id: int,
    payload: MaterialRequestApprove,
    db: Session = Depends(get_db)
):
    request = db.query(MaterialRequest).filter(MaterialRequest.id == request_id).first()

    if not request:
        raise HTTPException(status_code=404, detail="Request not found")

    if request.status != "pending":
        raise HTTPException(status_code=400, detail="Request already processed")

    if payload.status not in ["approved", "rejected"]:
        raise HTTPException(status_code=400, detail="Invalid status")

    request.status = payload.status

    db.commit()
    db.refresh(request)
    return request

@router.get("/{project_id}", response_model=list[MaterialRequestResponse])
def get_requests(project_id: int, db: Session = Depends(get_db)):
    return db.query(MaterialRequest).filter(
        MaterialRequest.project_id == project_id
    ).all()
