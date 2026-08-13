# Auth: register, login, duplicate username, protected endpoint access
def test_register_user(client):
    response = client.post(
        "/api/v1/auth/register", json={"username": "newuser", "password": "password123"}
    )
    assert response.status_code == 201
    body = response.json()
    assert body["username"] == "newuser"
    assert "password" not in body
    assert "password_hash" not in body


def test_login_user(client):
    client.post(
        "/api/v1/auth/register", json={"username": "loginuser", "password": "password123"}
    )
    response = client.post(
        "/api/v1/auth/login",
        data={"username": "loginuser", "password": "password123"},
    )
    assert response.status_code == 200
    body = response.json()
    assert body["token_type"] == "bearer"
    assert body["access_token"]


def test_invalid_login(client):
    client.post(
        "/api/v1/auth/register", json={"username": "someuser", "password": "password123"}
    )
    response = client.post(
        "/api/v1/auth/login",
        data={"username": "someuser", "password": "wrongpassword"},
    )
    assert response.status_code == 401


def test_duplicate_username(client):
    client.post(
        "/api/v1/auth/register", json={"username": "dupeuser", "password": "password123"}
    )
    response = client.post(
        "/api/v1/auth/register", json={"username": "dupeuser", "password": "password456"}
    )
    assert response.status_code == 400


def test_protected_endpoint_requires_token(client):
    response = client.get("/api/v1/auth/me")
    assert response.status_code == 401


def test_protected_endpoint_with_token(client, auth_headers):
    response = client.get("/api/v1/auth/me", headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["username"] == "bharani"
