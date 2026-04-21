import express from "express";
import { createPaymentController } from "../controllers/paymentController";
import { authenticate } from "../middlewares/authMiddleware";
import { authorize } from "../middlewares/roleMiddleware";

const router = express.Router();

// Tourist only
router.post(
    "/",
    authenticate,
    authorize("Tourist"),
    createPaymentController
);

export default router;