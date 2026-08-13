import api from "./api";
import type { User } from "../types";

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

// Login uses the OAuth2 password flow, so the backend expects form data
export async function login(username: string, password: string): Promise<TokenResponse> {
  const formData = new URLSearchParams();
  formData.append("username", username);
  formData.append("password", password);

  const response = await api.post<TokenResponse>("/auth/login", formData, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  return response.data;
}

export async function register(username: string, password: string): Promise<User> {
  const response = await api.post<User>("/auth/register", { username, password });
  return response.data;
}

export async function getCurrentUser(): Promise<User> {
  const response = await api.get<User>("/auth/me");
  return response.data;
}
