// src/api/authApi.ts
import apiClient from "./apiClient";

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  email: string;
  password: string;
  name?: string;
};

export const authApi = {
  async login(payload: LoginPayload) {
    const res = await apiClient.post("/api/auth/login", payload);
    return res.data;
  },

  async register(payload: RegisterPayload) {
    const res = await apiClient.post("/api/auth/register", payload);
    return res.data;
  },

  async logout() {
    const res = await apiClient.post("/api/auth/logout");
    return res.data;
  },

  async me() {
    const res = await apiClient.get("/api/auth/me");
    return res.data;
  },
};

export default authApi;
