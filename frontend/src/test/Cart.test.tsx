import { useEffect, type ReactNode } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { CartProvider, useCart } from "../context/CartContext";
import MenuCard from "../components/MenuCard";
import Cart from "../pages/Cart";

const sampleItem = {
  id: 1,
  name: "Classic Burger",
  description: "Tasty",
  price: 199,
  image_url: null,
};

function CartCountBadge() {
  const { totalCount } = useCart();
  return <p>Items in cart: {totalCount}</p>;
}

function SeedCart({ children }: { children: ReactNode }) {
  const { addItem } = useCart();
  // Seed once on mount only: addItem isn't memoized by CartContext, so
  // depending on it here would re-fire this effect every render and loop.
  useEffect(() => {
    addItem(sampleItem);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <>{children}</>;
}

describe("cart behavior", () => {
  it("adds an item to the cart", () => {
    render(
      <CartProvider>
        <MenuCard item={sampleItem} />
        <CartCountBadge />
      </CartProvider>
    );

    expect(screen.getByText("Items in cart: 0")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /add/i }));
    expect(screen.getByText("Items in cart: 1")).toBeInTheDocument();
  });

  it("changes quantity and updates the total", async () => {
    render(
      <MemoryRouter>
        <CartProvider>
          <SeedCart>
            <Cart />
          </SeedCart>
        </CartProvider>
      </MemoryRouter>
    );

    await screen.findByText("Classic Burger");
    expect(screen.getByTestId("cart-total")).toHaveTextContent("₹199.00");

    fireEvent.click(screen.getByText("+"));

    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByTestId("cart-total")).toHaveTextContent("₹398.00");
  });
});
