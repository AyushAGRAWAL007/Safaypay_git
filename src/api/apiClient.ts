// src/api/apiClient.ts
import axios from "axios";

const API_BASE = import.meta.env?.VITE_API_BASE ?? process.env.REACT_APP_API_BASE ?? "";

const apiClient = axios.create({
  baseURL: API_BASE || undefined,
  headers: { "Content-Type": "application/json" },
  withCredentials: false,
});

export function setAuthToken(token?: string) {
  if (token) apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete apiClient.defaults.headers.common["Authorization"];
}

export default apiClient;
