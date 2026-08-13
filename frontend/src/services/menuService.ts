import api from "./api";
import type { MenuItem } from "../types";

export async function getMenuItems(): Promise<MenuItem[]> {
  const response = await api.get<MenuItem[]>("/menu");
  return response.data;
}

export async function getMenuItem(id: number): Promise<MenuItem> {
  const response = await api.get<MenuItem>(`/menu/${id}`);
  return response.data;
}
