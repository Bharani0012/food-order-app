# Pydantic request/response schemas
from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.models import OrderStatus


# ---- Auth ----


class UserCreate(BaseModel):
    username: str = Field(min_length=3, max_length=50)
    password: str = Field(min_length=6, max_length=100)


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    username: str
    created_at: datetime


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


# ---- Menu ----


class MenuItemOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    description: Optional[str] = None
    price: float
    image_url: Optional[str] = None


# ---- Orders ----


class OrderItemCreate(BaseModel):
    menu_item_id: int
    quantity: int = Field(gt=0)


class OrderCreate(BaseModel):
    delivery_name: str = Field(min_length=1, max_length=100)
    delivery_address: str = Field(min_length=1, max_length=255)
    delivery_phone: str = Field(min_length=7, max_length=20)
    items: List[OrderItemCreate]

    @field_validator("delivery_phone")
    @classmethod
    def phone_must_be_digits(cls, value: str) -> str:
        cleaned = value.replace(" ", "").replace("-", "")
        if not cleaned.isdigit():
            raise ValueError("delivery_phone must contain only digits")
        return value

    @field_validator("items")
    @classmethod
    def must_have_at_least_one_item(cls, value: List[OrderItemCreate]):
        if not value:
            raise ValueError("order must contain at least one item")
        return value


class OrderItemOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    menu_item_id: int
    quantity: int
    unit_price: float
    subtotal: float


class OrderOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    delivery_name: str
    delivery_address: str
    delivery_phone: str
    total_amount: float
    status: OrderStatus
    created_at: datetime
    updated_at: datetime
    items: List[OrderItemOut]


class OrderStatusUpdate(BaseModel):
    status: OrderStatus
