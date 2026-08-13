import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { createOrder } from "../services/orderService";

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");

    if (!/^\d{7,15}$/.test(phone)) {
      setError("Enter a valid phone number (digits only)");
      return;
    }

    setSubmitting(true);
    try {
      const order = await createOrder({
        delivery_name: name,
        delivery_address: address,
        delivery_phone: phone,
        items: items.map((item) => ({ menu_item_id: item.id, quantity: item.quantity })),
      });
      clearCart();
      navigate(`/orders/${order.id}`);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.detail) {
        setError(String(err.response.data.detail));
      } else {
        setError("Could not place order");
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <p className="text-neutral-500">Your cart is empty. Add items before checking out.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <form onSubmit={handleSubmit} className="md:col-span-3 bg-white rounded-2xl shadow-sm border border-neutral-100 p-6 flex flex-col gap-4">
          <h2 className="font-semibold text-neutral-900">Delivery details</h2>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-neutral-700">Name</span>
            <input
              className="border border-neutral-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-neutral-700">Address</span>
            <input
              className="border border-neutral-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Delivery address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-neutral-700">Phone Number</span>
            <input
              className="border border-neutral-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="10-digit phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </label>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            disabled={submitting}
            className="bg-orange-600 text-white font-semibold rounded-full py-3 mt-2 hover:bg-orange-700 active:scale-[0.99] transition disabled:opacity-50"
          >
            {submitting ? "Placing order..." : "Place Order"}
          </button>
        </form>

        <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-neutral-100 p-6 h-fit">
          <h2 className="font-semibold text-neutral-900 mb-4">Order Summary</h2>
          <div className="flex flex-col gap-2">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm text-neutral-600">
                <span className="truncate pr-2">
                  {item.name} <span className="text-neutral-400">× {item.quantity}</span>
                </span>
                <span className="font-medium text-neutral-900 flex-shrink-0">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-neutral-100">
            <span className="font-semibold text-neutral-900">Total</span>
            <span className="text-lg font-bold text-neutral-900">₹{totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
