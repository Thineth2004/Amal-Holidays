import express from "express";
import { createBookingController } from "../controllers/bookingController";
import { authenticate } from "../middlewares/authMiddleware";
import { authorize } from "../middlewares/roleMiddleware";
import { validateBookingInput } from "../middlewares/validateMiddleware";

const router = express.Router();

// Tourist only
router.post(
  "/",
  authenticate,
  authorize("Tourist"),
  validateBookingInput,
  createBookingController
);

export default router;