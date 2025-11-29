// src/controllers/verificationController.js
import path from "path";
import { Verification, Photo, Transaction } from "../models/index.js";

/**
 * Receiver submits verification (with photo upload).
 * Route expects multipart/form-data:
 * - file: image
 * - verificationId: friendly id or transactionId
 * - location, lat, lng, device
 */
export const submitVerification = async (req, res) => {
  try {
    // multer gives file at req.file
    const file = req.file;
    const { verificationId, transactionId, location, lat, lng, device } = req.body;

    // find verification either by verificationId or transactionId
    let ver;
    if (verificationId) ver = await Verification.findOne({ verificationId });
    else if (transactionId) {
      const tx = await Transaction.findOne({ transactionId });
      if (!tx) return res.status(404).json({ error: "Transaction not found" });
      ver = await Verification.findOne({ transaction: tx._id });
    }

    if (!ver) return res.status(404).json({ error: "Verification not found" });

    // create Photo record
    const url = file ? `/uploads/${path.basename(file.path)}` : null;
    const photo = await Photo.create({
      url,
      storageType: "external",
      filename: file ? path.basename(file.path) : null,
      contentType: file ? file.mimetype : null,
      size: file ? file.size : 0,
      metadata: { device, location, coordinates: { lat, lng } }
    });

    // attach photo to verification
    ver.photoRef = photo._id;
    ver.photoSnapshotUrl = url;
    ver.location = location || ver.location;
    ver.coordinates = lat && lng ? { lat: parseFloat(lat), lng: parseFloat(lng) } : ver.coordinates;
    ver.metadata = { ...ver.metadata, device };
    ver.status = "processing";
    await ver.save();

    // Notify: in production you would enqueue AI processing / send message to agent
    // Here we just respond; AI agent will poll /ai/process-verification or you can call /ai/simulate
    return res.status(200).json({ verification: ver, photo });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

/**
 * Endpoint for Agentic AI to write results of processing
 * Body: { verificationId, verdict: 'pass'|'fail'|'manual_review', score: number, details: {} }
 */
export const postAiResult = async (req, res) => {
  try {
    const { verificationId, verdict = "unknown", score = 0, details = {} } = req.body;
    if (!verificationId) return res.status(400).json({ error: "verificationId required" });

    const ver = await Verification.findOne({ verificationId }).populate("transaction");
    if (!ver) return res.status(404).json({ error: "Verification not found" });

    ver.aiResult = { score, verdict, details };
    ver.status = verdict === "pass" ? "verified" : (verdict === "fail" ? "failed" : "processing");
    ver.processedAt = new Date();
    await ver.save();

    // update transaction status if present
    if (ver.transaction) {
      const tx = await Transaction.findById(ver.transaction);
      if (tx) {
        if (ver.status === "verified") tx.status = "verified";
        if (ver.status === "failed") tx.status = "failed";
        await tx.save();
      }
    }

    return res.json({ verification: ver });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const getVerification = async (req, res) => {
  try {
    const { id } = req.params; // verificationId
    const ver = await Verification.findOne({ verificationId: id }).populate("photoRef");
    if (!ver) return res.status(404).json({ error: "Verification not found" });
    return res.json(ver);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};
