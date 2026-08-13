# Shared test fixtures: an isolated SQLite DB per test + a client fixture
import os

# Point the app at a throwaway SQLite file instead of Postgres, before any
# app module is imported (app.database creates its engine at import time)
os.environ["DATABASE_URL"] = "sqlite:///./test.db"
os.environ["JWT_SECRET_KEY"] = "test-secret-key-for-pytest-only-32-bytes-min"

import pytest
from fastapi.testclient import TestClient

from app.database import Base, engine
from app.main import app


@pytest.fixture()
def setup_database():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture()
def client(setup_database):
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture()
def auth_headers(client):
    client.post(
        "/api/v1/auth/register", json={"username": "bharani", "password": "password123"}
    )
    response = client.post(
        "/api/v1/auth/login",
        data={"username": "bharani", "password": "password123"},
    )
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}
