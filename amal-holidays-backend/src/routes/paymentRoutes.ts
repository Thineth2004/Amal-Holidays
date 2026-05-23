import express from "express";
import { createPaymentController, getAllPaymentsController } from "../controllers/paymentController";
import { authenticate } from "../middlewares/authMiddleware";
import { authorize } from "../middlewares/roleMiddleware";

const router = express.Router();

// Manager/Staff only - Get all payments
router.get(
    "/",
    authenticate,
    authorize("Manager", "Staff"),
    getAllPaymentsController
);

// Tourist only - Create payment
router.post(
    "/",
    authenticate,
    authorize("Tourist"),
    createPaymentController
);

export default router;
