import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import CartItemRow from "../components/CartItemRow";

export default function Cart() {
  const { items, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <p className="text-5xl mb-4">🛒</p>
        <h1 className="text-lg font-semibold text-neutral-900">Your cart is empty</h1>
        <p className="text-neutral-500 mt-1 mb-6">Add something tasty from the menu.</p>
        <Link
          to="/menu"
          className="inline-block bg-orange-600 text-white font-semibold px-5 py-2.5 rounded-full hover:bg-orange-700 transition"
        >
          Browse the menu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">Your Cart</h1>

      <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 px-5">
        {items.map((item) => (
          <CartItemRow key={item.id} item={item} />
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 mt-4 p-5 flex justify-between items-center">
        <span className="text-neutral-600 font-medium">Total</span>
        <span data-testid="cart-total" className="text-xl font-bold text-neutral-900">
          ₹{totalPrice.toFixed(2)}
        </span>
      </div>

      <Link
        to="/checkout"
        className="mt-4 block text-center bg-orange-600 text-white font-semibold py-3 rounded-full hover:bg-orange-700 active:scale-[0.99] transition"
      >
        Proceed to Checkout
      </Link>
    </div>
  );
}
