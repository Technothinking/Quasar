from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date, timedelta

from app.api.deps import get_db
from app.models.dpr import DPR
from app.schemas.dpr import DPRCreate, DPRResponse

router = APIRouter(prefix="/dprs", tags=["DPRs"])

@router.post("/", response_model=DPRResponse)
def create_dpr(
    dpr_in: DPRCreate,
    db: Session = Depends(get_db),
):
    # NOTE: later we’ll extract user_id from Supabase JWT
    user_id = "user_123"  # TEMP

    existing = db.query(DPR).filter(
        DPR.project_id == dpr_in.project_id,
        DPR.date == dpr_in.date
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="DPR already submitted for this project and date"
        )

    dpr = DPR(
        project_id=dpr_in.project_id,
        milestone_id=dpr_in.milestone_id,
        date=dpr_in.date,
        active_stage=dpr_in.active_stage,
        work_status=dpr_in.work_status,
        issues=dpr_in.issues,
        issue_note=dpr_in.issue_note,
        submitted_by=user_id,
    )

    db.add(dpr)
    db.commit()
    db.refresh(dpr)

    return dpr

@router.get("/{project_id}", response_model=list[DPRResponse])
def get_project_dprs(
    project_id: int,
    db: Session = Depends(get_db),
):
    return (
        db.query(DPR)
        .filter(DPR.project_id == project_id)
        .order_by(DPR.date.desc())
        .all()
    )


@router.get("/{project_id}/missing")
def get_missing_dprs(
    project_id: int,
    start_date: date,
    end_date: date,
    db: Session = Depends(get_db),
):
    submitted_dates = {
        d.date for d in db.query(DPR.date)
        .filter(
            DPR.project_id == project_id,
            DPR.date >= start_date,
            DPR.date <= end_date
        )
        .all()
    }

    missing = []
    current = start_date

    while current <= end_date:
        if current not in submitted_dates:
            missing.append(current)
        current += timedelta(days=1)

    return {
        "project_id": project_id,
        "missing_dates": missing,
        "count": len(missing)
    }
