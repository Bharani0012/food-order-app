# FastAPI app entrypoint: wiring, CORS, and startup menu seeding
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import SessionLocal
from app.models import MenuItem
from app.routers import auth, menu, orders

# image_url uses loremflickr.com with a fixed "lock" seed per item so the
# same real food photo is returned on every request (not a re-roll each time)
SAMPLE_MENU_ITEMS = [
    {
        "name": "Margherita Pizza",
        "description": "Fresh tomato and mozzarella",
        "price": 299,
        "image_url": "https://loremflickr.com/400/300/margherita,pizza?lock=1",
    },
    {
        "name": "Classic Burger",
        "description": "Juicy grilled patty with cheese and lettuce",
        "price": 199,
        "image_url": "https://loremflickr.com/400/300/burger?lock=2",
    },
    {
        "name": "Chicken Biryani",
        "description": "Fragrant basmati rice with spiced chicken",
        "price": 249,
        "image_url": "https://loremflickr.com/400/300/biryani?lock=3",
    },
    {
        "name": "French Fries",
        "description": "Crispy golden fries with a pinch of salt",
        "price": 99,
        "image_url": "https://loremflickr.com/400/300/frenchfries?lock=4",
    },
    {
        "name": "Veg Sandwich",
        "description": "Grilled sandwich loaded with fresh vegetables",
        "price": 129,
        "image_url": "https://loremflickr.com/400/300/sandwich?lock=5",
    },
    {
        "name": "Chicken Pizza",
        "description": "Loaded with grilled chicken and mozzarella",
        "price": 349,
        "image_url": "https://loremflickr.com/400/300/chicken,pizza?lock=6",
    },
]


def seed_menu_items() -> None:
    db = SessionLocal()
    try:
        if db.query(MenuItem).first() is None:
            db.bulk_save_objects([MenuItem(**item) for item in SAMPLE_MENU_ITEMS])
            db.commit()
    finally:
        db.close()


@asynccontextmanager
async def lifespan(app: FastAPI):
    seed_menu_items()
    yield


app = FastAPI(title="Food Order Management API", lifespan=lifespan)

# Simple/open CORS since this is a local assessment project, not a public deployment
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(menu.router)
app.include_router(orders.router)


@app.get("/api/v1/health")
def health_check():
    return {"status": "ok"}
