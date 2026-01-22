from fastapi import APIRouter, UploadFile, File, Form, Depends
from sqlalchemy.orm import Session
from uuid import uuid4

from app.api.deps import get_db
from app.models.image import Image
from app.core.supabase import supabase

router = APIRouter(prefix="/images", tags=["Images"])

@router.post("/")
def upload_image(
    project_id: int = Form(...),
    entity_type: str = Form(...),
    entity_id: int = Form(...),
    uploaded_by: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    file_ext = file.filename.split(".")[-1]
    file_name = f"{uuid4()}.{file_ext}"

    storage_path = f"{entity_type}/{entity_id}/{file_name}"

    # ✅ READ FILE AS BYTES
    file_bytes = file.file.read()

    supabase.storage.from_("constructpro-images").upload(
        storage_path,
        file_bytes,
        {
            "content-type": file.content_type,
            "upsert": False
        }
    )

    public_url = supabase.storage.from_("constructpro-images") \
        .get_public_url(storage_path)

    image = Image(
        project_id=project_id,
        entity_type=entity_type,
        entity_id=entity_id,
        image_url=public_url,
        uploaded_by=uploaded_by
    )

    db.add(image)
    db.commit()
    db.refresh(image)

    return image
