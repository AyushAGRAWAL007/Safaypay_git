// src/models/Photo.js
import mongoose from "mongoose";
import { nanoid } from "nanoid";

const { Schema, model } = mongoose;

const PhotoSchema = new Schema({
  photoId: { type: String, default: () => nanoid(12), index: true, unique: true },
  url: { type: String },            
  storageType: { type: String, enum: ["gridfs","cloud","base64","external"], default: "external" },
  filename: String,
  contentType: String,
  size: Number,
  metadata: Schema.Types.Mixed,
  uploadedBy: { type: Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

export default model("Photo", PhotoSchema);
