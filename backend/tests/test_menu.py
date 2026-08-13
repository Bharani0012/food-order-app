# Menu: listing seeded items and fetching a single item
def test_get_menu(client):
    response = client.get("/api/v1/menu")
    assert response.status_code == 200
    items = response.json()
    assert len(items) == 6
    assert {"id", "name", "description", "price", "image_url"} <= items[0].keys()


def test_get_single_menu_item(client):
    menu_items = client.get("/api/v1/menu").json()
    first_item = menu_items[0]

    response = client.get(f"/api/v1/menu/{first_item['id']}")
    assert response.status_code == 200
    assert response.json()["name"] == first_item["name"]


def test_get_menu_item_not_found(client):
    response = client.get("/api/v1/menu/99999")
    assert response.status_code == 404
