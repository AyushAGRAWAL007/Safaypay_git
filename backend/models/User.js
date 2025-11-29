// src/models/User.js
import mongoose from "mongoose";
import { nanoid } from "nanoid";
import bcrypt from "bcryptjs";

const { Schema, model } = mongoose;

const SettingsSchema = new Schema({
  transactionLimit: { type: Number, default: 5000 }, 
  biometricEnabled: { type: Boolean, default: false },
  locationTracking: { type: Boolean, default: true },
  securityAlerts: { type: Boolean, default: true },
}, { _id: false });

const DeviceSchema = new Schema({
  deviceId: String,
  name: String,
  lastSeenAt: Date,
  meta: Schema.Types.Mixed
}, { _id: false });

const CardSchema = new Schema({
  cardId: String,
  brand: String,
  last4: String,
  expiry: String,
  tokenRef: String
}, { _id: false });

const UserSchema = new Schema({
  uid: { type: String, default: () => nanoid(10), index: true, unique: true },
  firebaseUid: { type: String, default: null },
  name: { type: String, required: true },
  email: { type: String, required: true, lowercase: true, index: true, unique: true },
  phone: { type: String, index: true, sparse: true },
  passwordHash: { type: String },
  settings: { type: SettingsSchema, default: () => ({}) },
  cards: { type: [CardSchema], default: [] },
  devices: { type: [DeviceSchema], default: [] },
  isVerified: { type: Boolean, default: false },
  role: { type: String, enum: ["user","admin"], default: "user" },
}, { timestamps: true });

UserSchema.methods.setPassword = async function(password) {
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(password, salt);
};

UserSchema.methods.verifyPassword = async function(password) {
  if (!this.passwordHash) return false;
  return bcrypt.compare(password, this.passwordHash);
};

export default model("User", UserSchema);
