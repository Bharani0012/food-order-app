import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Menu from "../pages/Menu";
import { CartProvider } from "../context/CartContext";
import * as menuService from "../services/menuService";

vi.mock("../services/menuService");

describe("Menu page", () => {
  it("renders menu items returned by the API", async () => {
    vi.mocked(menuService.getMenuItems).mockResolvedValue([
      { id: 1, name: "Margherita Pizza", description: "Cheese", price: 299, image_url: null },
    ]);

    render(
      <CartProvider>
        <Menu />
      </CartProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("Margherita Pizza")).toBeInTheDocument();
    });
    expect(screen.getByText("₹299")).toBeInTheDocument();
  });
});
