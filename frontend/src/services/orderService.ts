import api from "./api";
import type { Order } from "../types";

export interface OrderItemInput {
  menu_item_id: number;
  quantity: number;
}

export interface OrderCreateInput {
  delivery_name: string;
  delivery_address: string;
  delivery_phone: string;
  items: OrderItemInput[];
}

export async function createOrder(orderData: OrderCreateInput): Promise<Order> {
  const response = await api.post<Order>("/orders", orderData);
  return response.data;
}

export async function getOrder(orderId: number | string): Promise<Order> {
  const response = await api.get<Order>(`/orders/${orderId}`);
  return response.data;
}

export async function getOrders(): Promise<Order[]> {
  const response = await api.get<Order[]>("/orders");
  return response.data;
}

export function getOrderStatusSocketUrl(orderId: number | string): string {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";
  const wsUrl = apiUrl.replace(/^http/, "ws");
  return `${wsUrl}/orders/${orderId}/status`;
}
