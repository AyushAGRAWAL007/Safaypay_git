// src/routes/verificationRoutes.js
import express from "express";
import upload from "../middleware/upload.js";
import { submitVerification, postAiResult, getVerification } from "../controllers/verificationController.js";
const router = express.Router();

// receiver submits verification with image (multipart)
router.post("/submit", upload.single("file"), submitVerification);

// Agentic AI posts results
router.post("/ai/result", express.json(), postAiResult);

// get verification by verificationId
router.get("/:id", getVerification);

export default router;
