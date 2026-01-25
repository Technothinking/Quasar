from fastapi import APIRouter, File, UploadFile, HTTPException
from insightface.app import FaceAnalysis
import cv2
import numpy as np
import io

router = APIRouter(prefix="/face", tags=["Face"])

# Initialize Model (Lazy loading or global)
# buffalo_l is the model name requested by the user
app = FaceAnalysis(name="buffalo_l")
app.prepare(ctx_id=0) # ctx_id=0 for GPU, -1 for CPU. Defaulting to 0 as per user code.

@router.post("/embedding")
async def generate_embedding(file: UploadFile = File(...)):
    try:
        # Read image
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if img is None:
            raise HTTPException(status_code=400, detail="Invalid image data")

        # Get faces
        faces = app.get(img)

        if len(faces) == 0:
            raise HTTPException(status_code=400, detail="No face detected in the image")
        if len(faces) > 1:
            raise HTTPException(status_code=400, detail="Exactly one face required, but multiple were detected")

        # Get embedding
        embedding = faces[0].embedding
        return {"embedding": embedding.tolist()}

    except Exception as e:
        print(f"Embedding error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
