// src/models/Verification.js
import mongoose from "mongoose";
import { nanoid } from "nanoid";

const { Schema, model } = mongoose;

const VerificationSchema = new Schema({
  verificationId: { type: String, default: () => nanoid(12), unique: true, index: true },
  transaction: { type: Schema.Types.ObjectId, ref: "Transaction", required: true },
  receiver: {
    name: String,
    contact: String,
    userRef: { type: Schema.Types.ObjectId, ref: "User", default: null }
  },
  photoRef: { type: Schema.Types.ObjectId, ref: "Photo" },
  photoSnapshotUrl: String,
  metadata: Schema.Types.Mixed,
  location: String,
  coordinates: {
    lat: Number,
    lng: Number
  },
  aiResult: {
    score: { type: Number, default: 0 },
    verdict: { type: String, enum: ["unknown","pass","fail","manual_review"], default: "unknown" },
    details: Schema.Types.Mixed
  },
  status: { type: String, enum: ["pending","processing","verified","failed","rejected"], default: "pending" },
  processedAt: Date
}, { timestamps: true });

export default model("Verification", VerificationSchema);
