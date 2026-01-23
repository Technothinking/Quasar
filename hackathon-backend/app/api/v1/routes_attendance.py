from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date, datetime
from app.api.deps import get_db
from app.models.attendance import Attendance
from app.schemas.attendance import CheckInOut, SupervisorMarkAttendance
from app.models.project_site import ProjectSite
from app.utils.location import is_within_radius

router = APIRouter(prefix="/attendance", tags=["Attendance"])


@router.post("/check-in")
def check_in(payload: CheckInOut, db: Session = Depends(get_db)):
    site = db.query(ProjectSite).filter(
        ProjectSite.project_id == payload.project_id
    ).first()

    if not site:
        raise HTTPException(404, "Project site location not configured")

    if not is_within_radius(
        payload.latitude,
        payload.longitude,
        site.latitude,
        site.longitude,
        site.radius_meters
    ):
        raise HTTPException(403, "You are not at the project site")

    today = date.today()

    attendance = db.query(Attendance).filter(
        Attendance.project_id == payload.project_id,
        Attendance.user_id == "user_123",
        Attendance.date == today
    ).first()

    if not attendance:
        attendance = Attendance(
            project_id=payload.project_id,
            user_id="user_123",
            role="worker",
            date=today,
            check_in_time=datetime.utcnow(),
            method="self"
        )
        db.add(attendance)
    else:
        attendance.check_in_time = datetime.utcnow()

    db.commit()
    return {"message": "Checked in successfully"}

@router.post("/supervisor-mark")
def supervisor_mark(payload: SupervisorMarkAttendance, db: Session = Depends(get_db)):
    today = date.today()

    attendance = db.query(Attendance).filter(
        Attendance.project_id == payload.project_id,
        Attendance.user_id == payload.user_id,
        Attendance.date == today
    ).first()

    if not attendance:
        attendance = Attendance(
            project_id=payload.project_id,
            user_id=payload.user_id,
            role=payload.role,
            date=today,
            status=payload.status,
            method="supervisor"
        )
        db.add(attendance)
    else:
        attendance.status = payload.status
        attendance.method = "supervisor"

    db.commit()
    return {"message": "Attendance updated"}

@router.post("/check-out")
def check_out(payload: CheckInOut, db: Session = Depends(get_db)):
    today = date.today()

    attendance = db.query(Attendance).filter(
        Attendance.project_id == payload.project_id,
        Attendance.user_id == "user_123",
        Attendance.date == today
    ).first()

    if not attendance:
        raise HTTPException(400, "No check-in found")

    attendance.check_out_time = datetime.utcnow()
    db.commit()
    return {"message": "Checked out successfully"}

