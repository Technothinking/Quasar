from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.models.material_stock import MaterialStock
from app.schemas.material_stock import MaterialStockCreate, MaterialStockResponse, MaterialStockUpdate
from fastapi import HTTPException

router = APIRouter(prefix="/material-stock", tags=["Material Stock"])


@router.post("/", response_model=MaterialStockResponse)
def upsert_material_stock(payload: MaterialStockCreate, db: Session = Depends(get_db)):
    stock = db.query(MaterialStock).filter(
        MaterialStock.project_id == payload.project_id,
        MaterialStock.material_name == payload.material_name
    ).first()

    if stock:
        stock.current_quantity = payload.current_quantity
        stock.unit = payload.unit
    else:
        stock = MaterialStock(**payload.dict())

    db.add(stock)
    db.commit()
    db.refresh(stock)
    return stock


@router.get("/{project_id}", response_model=list[MaterialStockResponse])
def get_project_stock(project_id: int, db: Session = Depends(get_db)):
    return db.query(MaterialStock).filter(MaterialStock.project_id == project_id).all()

@router.patch("/{stock_id}", response_model=MaterialStockResponse)
def update_material_stock(
    stock_id: int,
    payload: MaterialStockUpdate,
    db: Session = Depends(get_db)
):
    stock = db.query(MaterialStock).filter(MaterialStock.id == stock_id).first()

    if not stock:
        raise HTTPException(status_code=404, detail="Material stock not found")

    if payload.current_quantity is not None:
        stock.current_quantity = payload.current_quantity

    if payload.unit is not None:
        stock.unit = payload.unit

    db.commit()
    db.refresh(stock)
    return stock