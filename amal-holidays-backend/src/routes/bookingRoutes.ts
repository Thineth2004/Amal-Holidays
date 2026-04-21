import express from "express";
import { createBookingController } from "../controllers/bookingController";
import { authenticate } from "../middlewares/authMiddleware";
import { authorize } from "../middlewares/roleMiddleware";

const router = express.Router();

// Tourist only
router.post(
  "/",
  authenticate,
  authorize("Tourist"),
  createBookingController
);

export default router;