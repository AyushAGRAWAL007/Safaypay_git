// src/routes/transactionRoutes.js
import express from "express";
import { createTransaction, getTransaction } from "../controllers/transactionController.js";
const router = express.Router();

router.post("/", createTransaction);            // create transaction
router.get("/:id", getTransaction);             // get transaction by transactionId

export default router;
