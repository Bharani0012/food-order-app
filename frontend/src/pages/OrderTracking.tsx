import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getOrder, getOrderStatusSocketUrl } from "../services/orderService";
import type { Order, OrderStatus } from "../types";
import OrderStatusTracker from "../components/OrderStatusTracker";

export default function OrderTracking() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    getOrder(id)
      .then(setOrder)
      .catch(() => setError("Order not found"));
  }, [id]);

  // Live status updates: the backend simulates the kitchen progressing the order
  useEffect(() => {
    if (!id) return;
    const socket = new WebSocket(getOrderStatusSocketUrl(id));
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data) as { status?: OrderStatus };
      if (data.status) {
        setOrder((prev) => (prev ? { ...prev, status: data.status as OrderStatus } : prev));
      }
    };
    return () => socket.close();
  }, [id]);

  if (error) {
    return <p className="max-w-2xl mx-auto px-4 py-12 text-red-600">{error}</p>;
  }

  if (!order) {
    return <p className="max-w-2xl mx-auto px-4 py-12 text-neutral-500">Loading order...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <Link to="/orders" className="text-sm text-orange-600 hover:underline">
        ← Back to Orders
      </Link>
      <div className="mb-6 mt-2">
        <p className="text-sm text-neutral-500">Order</p>
        <h1 className="text-2xl font-bold text-neutral-900">#{order.id}</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6">
          <h2 className="font-semibold text-neutral-900 mb-4">Status</h2>
          <OrderStatusTracker status={order.status} />
        </div>

        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6">
            <h2 className="font-semibold text-neutral-900 mb-3">Delivery Details</h2>
            <p className="text-neutral-800">{order.delivery_name}</p>
            <p className="text-neutral-500 text-sm mt-1">{order.delivery_address}</p>
            <p className="text-neutral-500 text-sm">{order.delivery_phone}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6">
            <h2 className="font-semibold text-neutral-900 mb-3">Items</h2>
            <div className="flex flex-col gap-1.5">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-neutral-600">
                    #{item.menu_item_id} <span className="text-neutral-400">× {item.quantity}</span>
                  </span>
                  <span className="font-medium text-neutral-900">₹{item.subtotal.toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between font-semibold text-neutral-900 mt-3 pt-3 border-t border-neutral-100">
              <span>Total</span>
              <span>₹{order.total_amount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
