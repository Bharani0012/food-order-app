// Shared types mirroring the backend Pydantic schemas

export interface MenuItem {
  id: number;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export type OrderStatus = "RECEIVED" | "PREPARING" | "OUT_FOR_DELIVERY" | "DELIVERED";

export interface OrderItem {
  id: number;
  menu_item_id: number;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface Order {
  id: number;
  user_id: number;
  delivery_name: string;
  delivery_address: string;
  delivery_phone: string;
  total_amount: number;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

export interface User {
  id: number;
  username: string;
  created_at: string;
}
