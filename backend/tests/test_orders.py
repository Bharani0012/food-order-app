# Orders: creation, total calculation, validation, ownership, status transitions
def get_menu_items(client):
    return client.get("/api/v1/menu").json()


def test_create_order(client, auth_headers):
    menu_items = get_menu_items(client)
    payload = {
        "delivery_name": "Bharani",
        "delivery_address": "Chennai",
        "delivery_phone": "9876543210",
        "items": [{"menu_item_id": menu_items[0]["id"], "quantity": 2}],
    }
    response = client.post("/api/v1/orders", json=payload, headers=auth_headers)
    assert response.status_code == 201
    body = response.json()
    assert body["status"] == "RECEIVED"
    assert len(body["items"]) == 1


def test_order_total_is_calculated_by_backend_not_client(client, auth_headers):
    menu_items = get_menu_items(client)
    pizza = menu_items[0]
    payload = {
        "delivery_name": "Bharani",
        "delivery_address": "Chennai",
        "delivery_phone": "9876543210",
        "items": [{"menu_item_id": pizza["id"], "quantity": 2}],
    }
    response = client.post("/api/v1/orders", json=payload, headers=auth_headers)
    assert response.status_code == 201
    body = response.json()
    expected_total = pizza["price"] * 2
    assert body["total_amount"] == expected_total
    assert body["items"][0]["unit_price"] == pizza["price"]
    assert body["items"][0]["subtotal"] == expected_total


def test_create_order_requires_auth(client):
    response = client.post(
        "/api/v1/orders",
        json={
            "delivery_name": "Bharani",
            "delivery_address": "Chennai",
            "delivery_phone": "9876543210",
            "items": [{"menu_item_id": 1, "quantity": 1}],
        },
    )
    assert response.status_code == 401


def test_create_order_invalid_quantity(client, auth_headers):
    menu_items = get_menu_items(client)
    payload = {
        "delivery_name": "Bharani",
        "delivery_address": "Chennai",
        "delivery_phone": "9876543210",
        "items": [{"menu_item_id": menu_items[0]["id"], "quantity": 0}],
    }
    response = client.post("/api/v1/orders", json=payload, headers=auth_headers)
    assert response.status_code == 422


def test_create_order_invalid_menu_item(client, auth_headers):
    payload = {
        "delivery_name": "Bharani",
        "delivery_address": "Chennai",
        "delivery_phone": "9876543210",
        "items": [{"menu_item_id": 99999, "quantity": 1}],
    }
    response = client.post("/api/v1/orders", json=payload, headers=auth_headers)
    assert response.status_code == 400


def test_create_order_requires_at_least_one_item(client, auth_headers):
    payload = {
        "delivery_name": "Bharani",
        "delivery_address": "Chennai",
        "delivery_phone": "9876543210",
        "items": [],
    }
    response = client.post("/api/v1/orders", json=payload, headers=auth_headers)
    assert response.status_code == 422


def test_create_order_invalid_phone(client, auth_headers):
    menu_items = get_menu_items(client)
    payload = {
        "delivery_name": "Bharani",
        "delivery_address": "Chennai",
        "delivery_phone": "not-a-phone",
        "items": [{"menu_item_id": menu_items[0]["id"], "quantity": 1}],
    }
    response = client.post("/api/v1/orders", json=payload, headers=auth_headers)
    assert response.status_code == 422


def create_order(client, auth_headers, quantity=1):
    menu_items = get_menu_items(client)
    payload = {
        "delivery_name": "Bharani",
        "delivery_address": "Chennai",
        "delivery_phone": "9876543210",
        "items": [{"menu_item_id": menu_items[0]["id"], "quantity": quantity}],
    }
    response = client.post("/api/v1/orders", json=payload, headers=auth_headers)
    return response.json()


def test_get_order(client, auth_headers):
    order = create_order(client, auth_headers)
    response = client.get(f"/api/v1/orders/{order['id']}", headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["id"] == order["id"]


def test_list_orders(client, auth_headers):
    create_order(client, auth_headers)
    create_order(client, auth_headers)
    response = client.get("/api/v1/orders", headers=auth_headers)
    assert response.status_code == 200
    assert len(response.json()) == 2


def test_cannot_access_another_users_order(client, auth_headers):
    order = create_order(client, auth_headers)

    client.post(
        "/api/v1/auth/register", json={"username": "otheruser", "password": "password123"}
    )
    login_response = client.post(
        "/api/v1/auth/login", data={"username": "otheruser", "password": "password123"}
    )
    other_headers = {
        "Authorization": f"Bearer {login_response.json()['access_token']}"
    }

    response = client.get(f"/api/v1/orders/{order['id']}", headers=other_headers)
    assert response.status_code == 403


def test_delete_order(client, auth_headers):
    order = create_order(client, auth_headers)
    response = client.delete(f"/api/v1/orders/{order['id']}", headers=auth_headers)
    assert response.status_code == 204

    response = client.get(f"/api/v1/orders/{order['id']}", headers=auth_headers)
    assert response.status_code == 404


def test_update_order_status_valid_transition(client, auth_headers):
    order = create_order(client, auth_headers)
    response = client.patch(
        f"/api/v1/orders/{order['id']}/status",
        json={"status": "PREPARING"},
        headers=auth_headers,
    )
    assert response.status_code == 200
    assert response.json()["status"] == "PREPARING"


def test_update_order_status_invalid_transition(client, auth_headers):
    order = create_order(client, auth_headers)
    response = client.patch(
        f"/api/v1/orders/{order['id']}/status",
        json={"status": "DELIVERED"},
        headers=auth_headers,
    )
    assert response.status_code == 400
