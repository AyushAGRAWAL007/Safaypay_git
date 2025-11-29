// src/api/transactionApi.ts
import apiClient from "./apiClient";

// ---------- TYPES ----------
export interface RecipientInfo {
  upi?: string;
  phone?: string;
  name?: string;
}

export interface CreateTransactionPayload {
  senderUid?: string;
  amount: number;
  recipient: RecipientInfo;
  senderLocation?: string;
}

export interface TransactionData {
  transactionId: string;
  amount: number;
  recipient: RecipientInfo;
  status?: string;
}

export interface VerificationData {
  verificationId: string;
  status: "processing" | "verified" | "failed" | "rejected";
  aiScore?: number;
  photoSnapshotUrl?: string;
  location?: string;
  coordinates?: { lat: number; lng: number };
}

export interface VerificationRequestResponse {
  transaction?: TransactionData;
  verification?: VerificationData;
  verificationRequired?: boolean;
}

// ---------- API ----------
export const transactionApi = {
  async createTransaction(
    payload: CreateTransactionPayload
  ): Promise<VerificationRequestResponse> {
    const res = await apiClient.post("/api/transactions", payload);
    return res.data as VerificationRequestResponse;
  },

  async getTransactionById(
    transactionId: string
  ): Promise<TransactionData> {
    const res = await apiClient.get(`/api/transactions/${transactionId}`);
    return res.data as TransactionData;
  },

  async finalizeTransaction(
    transactionId: string,
    data: Record<string, unknown> = {}
  ): Promise<{ success: boolean; transaction: TransactionData }> {
    const res = await apiClient.post(
      `/api/transactions/${transactionId}/finalize`,
      data
    );
    return res.data as { success: boolean; transaction: TransactionData };
  },

  async requestVerification(
    transactionId: string
  ): Promise<{ message: string; sent: boolean }> {
    const res = await apiClient.post(
      `/api/transactions/${transactionId}/request-verification`
    );
    return res.data as { message: string; sent: boolean };
  }
};

export default transactionApi;
