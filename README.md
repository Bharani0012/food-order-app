# Food Delivery Order Management System

## Project Overview

A simple full-stack food ordering app: browse a menu, build a cart, check out,
and track an order's status in real time. Built as a full-stack developer
assessment — the emphasis is on clean, understandable, working code rather
than architectural complexity.

## Features

- Username/password authentication with JWT
- Menu listing (seeded with sample items on first run)
- Cart managed entirely on the frontend (no cart table)
- Checkout that creates an order; **total is always calculated server-side**
- Order history, order detail, and per-order status tracking
- Order status progression (`RECEIVED` → `PREPARING` → `OUT_FOR_DELIVERY` → `DELIVERED`)
  simulated in real time over a WebSocket
- Ownership checks — a user can only see/modify their own orders

## Tech Stack

**Backend:** Python, FastAPI, PostgreSQL, SQLAlchemy, Alembic, Pydantic, JWT (PyJWT), bcrypt, Pytest
**Frontend:** React, TypeScript, Vite, Tailwind CSS, React Router, Axios, Vitest
**Infra:** Docker, Docker Compose

## Project Structure

```text
food-order-management/
├── backend/
│   ├── app/
│   │   ├── main.py            # app setup, CORS, menu seeding
│   │   ├── database.py        # SQLAlchemy engine/session
│   │   ├── models.py          # User, MenuItem, Order, OrderItem
│   │   ├── schemas.py         # Pydantic request/response models
│   │   ├── auth.py            # password hashing + JWT helpers
│   │   ├── dependencies.py    # get_current_user
│   │   ├── services.py        # order total calc, status transitions
│   │   └── routers/
│   │       ├── auth.py        # /api/v1/auth/*
│   │       ├── menu.py        # /api/v1/menu*
│   │       └── orders.py      # /api/v1/orders* + WebSocket
│   ├── tests/                 # Pytest suite (SQLite in-memory)
│   ├── alembic/                # migrations
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── components/        # Navbar, MenuCard, CartItemRow, OrderStatusTracker, ProtectedRoute
│   │   ├── pages/              # Login, Register, Menu, Cart, Checkout, OrderTracking
│   │   ├── services/           # axios instance + API calls
│   │   ├── context/             # AuthContext, CartContext
│   │   ├── test/                # Vitest component tests
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── vite.config.ts
│   └── Dockerfile
│
├── docker-compose.yml
├── .env.example
└── README.md
```

## Environment Variables

Copy `.env.example` to `.env` and adjust as needed before running Docker Compose:

```text
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=food_orders

DATABASE_URL=postgresql://postgres:postgres@postgres:5432/food_orders
JWT_SECRET_KEY=change-this-to-a-long-random-string
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30

VITE_API_URL=http://localhost:8000/api/v1
```

`DATABASE_URL` uses the Docker Compose service name `postgres` as the host.
`VITE_API_URL` uses `localhost` because it's read by the browser, not by a
container on the Docker network.

## Docker Setup

From the project root:

```bash
docker compose up --build
```

This starts three services:

- `postgres` — PostgreSQL 16
- `backend` — FastAPI on http://localhost:8000 (runs `alembic upgrade head` on startup, then seeds the menu if empty)
- `frontend` — Vite dev server on http://localhost:5173

Open http://localhost:5173 to use the app. API docs are at http://localhost:8000/docs.

## Database Migrations

Migrations run automatically when the backend container starts. To run them manually:

```bash
cd backend
alembic upgrade head
```

To create a new migration after changing `app/models.py`:

```bash
alembic revision --autogenerate -m "describe the change"
```

## Running Tests

**Backend (Pytest, uses an isolated SQLite file — no Postgres required):**

```bash
cd backend
pip install -r requirements.txt
pytest
```

**Frontend (Vitest + React Testing Library):**

```bash
cd frontend
npm install
npm test
```

## API Endpoints

```text
POST   /api/v1/auth/register
POST   /api/v1/auth/login
GET    /api/v1/auth/me

GET    /api/v1/menu
GET    /api/v1/menu/{id}

POST   /api/v1/orders
GET    /api/v1/orders
GET    /api/v1/orders/{id}
PATCH  /api/v1/orders/{id}/status
DELETE /api/v1/orders/{id}

WS     /api/v1/orders/{order_id}/status
```

## Authentication

- Passwords are hashed with bcrypt; plain-text passwords are never stored.
- `POST /auth/login` uses the OAuth2 password flow (`OAuth2PasswordRequestForm`)
  and returns a JWT access token with an expiration (`JWT_ACCESS_TOKEN_EXPIRE_MINUTES`).
- `get_current_user()` (in `app/dependencies.py`) decodes the bearer token and
  loads the user; all order endpoints depend on it.
- No refresh tokens, roles, or OAuth — kept intentionally simple.

## Order Flow

1. Frontend cart holds `{ menu_item_id, quantity }` pairs — no price is sent for the total.
2. `POST /api/v1/orders` looks up each menu item's **current price from the database**,
   computes `unit_price * quantity` per line, and sums the order total server-side
   (see `app/services.py::create_order`). The client-supplied total, if any, is ignored.
3. Order status starts at `RECEIVED` and can only move forward one step at a time
   (`RECEIVED → PREPARING → OUT_FOR_DELIVERY → DELIVERED`); invalid jumps are rejected
   with a 400.

## Real-Time Status

`WS /api/v1/orders/{order_id}/status` is a minimal simulation: on connect it sends the
order's current status, then every few seconds advances it to the next valid status
(persisting each change to the database) until it reaches `DELIVERED`. No message
broker — just `asyncio.sleep` in the endpoint handler. The socket itself skips JWT
auth for simplicity (browsers can't attach custom headers to a WebSocket handshake);
the REST endpoints remain the protected source of truth for reading/updating orders.

## AI Usage

This project was scaffolded with AI assistance (Claude). AI was used to generate the
initial project structure, boilerplate CRUD endpoints, and test scaffolding based on
a detailed specification. All generated code was reviewed and is intended to be
further debugged/extended by hand as noted in the assessment instructions.
