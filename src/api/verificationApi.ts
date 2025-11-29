// src/api/verificationApi.ts
import apiClient from "./apiClient";

// ---------- TYPES ----------
export interface VerificationResponse {
  verificationId: string;
  status: "processing" | "verified" | "failed" | "rejected";
  aiScore?: number;
  photoSnapshotUrl?: string;
  location?: string;
  coordinates?: { lat: number; lng: number };
  processedAt?: string;
}

export interface CreateVerificationPayload {
  transactionId: string;
  verificationId?: string;
}

export interface TransactionResponse {
  transactionId: string;
  amount: number;
  recipient: {
    upi?: string;
    phone?: string;
    name?: string;
  };
}

// ---------- API ----------
const verificationApi = {
  // Upload verification photo + metadata
  async submitVerification(formData: FormData): Promise<VerificationResponse> {
    const res = await apiClient.post("/api/verifications", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data as VerificationResponse;
  },

  // Get verification status by id
  async getVerification(verificationId: string): Promise<VerificationResponse> {
    const res = await apiClient.get(`/api/verifications/${verificationId}`);
    return res.data as VerificationResponse;
  },

  // Create transaction (if used here)
  async createTransaction(
    payload: CreateVerificationPayload
  ): Promise<TransactionResponse> {
    const res = await apiClient.post("/api/transactions", payload);
    return res.data as TransactionResponse;
  },
};

export default verificationApi;
