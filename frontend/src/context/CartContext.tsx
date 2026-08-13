// In-memory cart: add/remove items, change quantity, compute totals
import { createContext, useContext, useState, type ReactNode } from "react";
import type { CartItem, MenuItem } from "../types";

interface CartContextValue {
  items: CartItem[];
  addItem: (menuItem: MenuItem) => void;
  increaseQuantity: (menuItemId: number) => void;
  decreaseQuantity: (menuItemId: number) => void;
  removeItem: (menuItemId: number) => void;
  clearCart: () => void;
  totalCount: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  function addItem(menuItem: MenuItem) {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === menuItem.id);
      if (existing) {
        return prev.map((item) =>
          item.id === menuItem.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...menuItem, quantity: 1 }];
    });
  }

  function increaseQuantity(menuItemId: number) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === menuItemId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  }

  function decreaseQuantity(menuItemId: number) {
    setItems((prev) =>
      prev
        .map((item) =>
          item.id === menuItemId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function removeItem(menuItemId: number) {
    setItems((prev) => prev.filter((item) => item.id !== menuItemId));
  }

  function clearCart() {
    setItems([]);
  }

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        increaseQuantity,
        decreaseQuantity,
        removeItem,
        clearCart,
        totalCount,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
