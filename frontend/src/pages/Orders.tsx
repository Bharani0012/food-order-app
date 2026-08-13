import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getOrders } from "../services/orderService";
import type { Order, OrderStatus } from "../types";

const STATUS_STYLES: Record<OrderStatus, string> = {
  RECEIVED: "bg-neutral-100 text-neutral-600",
  PREPARING: "bg-orange-100 text-orange-700",
  OUT_FOR_DELIVERY: "bg-blue-100 text-blue-700",
  DELIVERED: "bg-green-100 text-green-700",
};

const STATUS_LABELS: Record<OrderStatus, string> = {
  RECEIVED: "Received",
  PREPARING: "Preparing",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
};

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrders()
      .then(setOrders)
      .catch(() => setError("Could not load your orders"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="max-w-2xl mx-auto px-4 py-12 text-neutral-500">Loading your orders...</p>;
  }

  if (error) {
    return <p className="max-w-2xl mx-auto px-4 py-12 text-red-600">{error}</p>;
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <p className="text-5xl mb-4">🧾</p>
        <h1 className="text-lg font-semibold text-neutral-900">No orders yet</h1>
        <p className="text-neutral-500 mt-1 mb-6">Your placed orders will show up here.</p>
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
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">My Orders</h1>

      <div className="flex flex-col gap-3">
        {orders.map((order) => (
          <Link
            key={order.id}
            to={`/orders/${order.id}`}
            className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-5 flex items-center justify-between hover:shadow-md transition-shadow"
          >
            <div>
              <p className="font-semibold text-neutral-900">Order #{order.id}</p>
              <p className="text-sm text-neutral-500 mt-0.5">
                {new Date(order.created_at).toLocaleString()} · {order.items.length}{" "}
                {order.items.length === 1 ? "item" : "items"}
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold text-neutral-900">₹{order.total_amount.toFixed(2)}</p>
              <span
                className={`inline-block mt-1 text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[order.status]}`}
              >
                {STATUS_LABELS[order.status]}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
