import { useEffect, type ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { CartProvider, useCart } from "../context/CartContext";
import Checkout from "../pages/Checkout";

// Seeds the cart with one item so the checkout form (instead of the "cart is
// empty" message) is what renders, without needing the Menu/Cart pages too.
function SeedCart({ children }: { children: ReactNode }) {
  const { addItem } = useCart();
  // Seed once on mount only: addItem isn't memoized by CartContext, so
  // depending on it here would re-fire this effect every render and loop.
  useEffect(() => {
    addItem({ id: 1, name: "Pizza", description: "", price: 100, image_url: null });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <>{children}</>;
}

describe("Checkout validation", () => {
  it("rejects a non-numeric phone number before calling the API", async () => {
    render(
      <MemoryRouter>
        <CartProvider>
          <SeedCart>
            <Checkout />
          </SeedCart>
        </CartProvider>
      </MemoryRouter>
    );

    await userEvent.type(await screen.findByLabelText("Name"), "Bharani");
    await userEvent.type(screen.getByLabelText("Address"), "Chennai");
    await userEvent.type(screen.getByLabelText("Phone Number"), "abc");
    await userEvent.click(screen.getByText("Place Order"));

    expect(await screen.findByText(/valid phone number/i)).toBeInTheDocument();
  });
});
