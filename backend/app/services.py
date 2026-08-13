# Business logic for orders (kept separate from routing/DB wiring)
from decimal import Decimal

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models import MenuItem, Order, OrderItem, OrderStatus
from app.schemas import OrderCreate

# Only these forward transitions are allowed
VALID_TRANSITIONS = {
    OrderStatus.RECEIVED: OrderStatus.PREPARING,
    OrderStatus.PREPARING: OrderStatus.OUT_FOR_DELIVERY,
    OrderStatus.OUT_FOR_DELIVERY: OrderStatus.DELIVERED,
    OrderStatus.DELIVERED: None,
}


def is_valid_transition(current: OrderStatus, new: OrderStatus) -> bool:
    return VALID_TRANSITIONS.get(current) == new


def next_status(current: OrderStatus) -> OrderStatus | None:
    return VALID_TRANSITIONS.get(current)


def create_order(db: Session, user_id: int, order_data: OrderCreate) -> Order:
    # Look up all referenced menu items in one query and validate they exist
    menu_item_ids = [item.menu_item_id for item in order_data.items]
    menu_items = db.query(MenuItem).filter(MenuItem.id.in_(menu_item_ids)).all()
    menu_items_by_id = {item.id: item for item in menu_items}

    missing_ids = set(menu_item_ids) - set(menu_items_by_id.keys())
    if missing_ids:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Menu item(s) not found: {sorted(missing_ids)}",
        )

    # Always price from the current DB value, never trust the client's total
    order_items = []
    total_amount = Decimal("0")
    for item in order_data.items:
        menu_item = menu_items_by_id[item.menu_item_id]
        unit_price = Decimal(str(menu_item.price))
        subtotal = unit_price * item.quantity
        total_amount += subtotal
        order_items.append(
            OrderItem(
                menu_item_id=menu_item.id,
                quantity=item.quantity,
                unit_price=unit_price,
                subtotal=subtotal,
            )
        )

    order = Order(
        user_id=user_id,
        delivery_name=order_data.delivery_name,
        delivery_address=order_data.delivery_address,
        delivery_phone=order_data.delivery_phone,
        total_amount=total_amount,
        status=OrderStatus.RECEIVED,
        items=order_items,
    )
    db.add(order)
    db.commit()
    db.refresh(order)
    return order
