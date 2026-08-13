import type { CartItem } from "../types";
import { useCart } from "../context/CartContext";

export default function CartItemRow({ item }: { item: CartItem }) {
  const { increaseQuantity, decreaseQuantity, removeItem } = useCart();

  return (
    <div className="flex items-center gap-4 py-4 border-b border-neutral-100 last:border-0">
      <img
        src={item.image_url ?? undefined}
        alt={item.name}
        className="w-16 h-16 rounded-xl object-cover bg-neutral-100 flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-neutral-900 truncate">{item.name}</p>
        <p className="text-sm text-neutral-500">₹{item.price} each</p>
      </div>
      <div className="flex items-center gap-2 bg-neutral-100 rounded-full px-1.5 py-1">
        <button
          onClick={() => decreaseQuantity(item.id)}
          aria-label="Decrease quantity"
          className="w-7 h-7 flex items-center justify-center rounded-full bg-white text-neutral-700 shadow-sm hover:bg-neutral-50 active:scale-95 transition"
        >
          −
        </button>
        <span className="w-6 text-center font-semibold text-neutral-900">{item.quantity}</span>
        <button
          onClick={() => increaseQuantity(item.id)}
          aria-label="Increase quantity"
          className="w-7 h-7 flex items-center justify-center rounded-full bg-white text-neutral-700 shadow-sm hover:bg-neutral-50 active:scale-95 transition"
        >
          +
        </button>
      </div>
      <span className="w-20 text-right font-semibold text-neutral-900">
        ₹{(item.price * item.quantity).toFixed(2)}
      </span>
      <button
        onClick={() => removeItem(item.id)}
        aria-label="Remove item"
        className="text-neutral-400 hover:text-red-600 transition-colors"
      >
        ✕
      </button>
    </div>
  );
}
