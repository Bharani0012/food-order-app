# Menu endpoints (read-only, public)
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import MenuItem
from app.schemas import MenuItemOut

router = APIRouter(prefix="/api/v1/menu", tags=["menu"])


@router.get("", response_model=list[MenuItemOut])
def list_menu_items(db: Session = Depends(get_db)):
    return db.query(MenuItem).order_by(MenuItem.id).all()


@router.get("/{item_id}", response_model=MenuItemOut)
def get_menu_item(item_id: int, db: Session = Depends(get_db)):
    menu_item = db.query(MenuItem).filter(MenuItem.id == item_id).first()
    if not menu_item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Menu item not found")
    return menu_item
