import express from "express";
import { createBookingController, getAllBookingsController } from "../controllers/bookingController";
import { authenticate } from "../middlewares/authMiddleware";
import { authorize } from "../middlewares/roleMiddleware";
import { validateBookingInput } from "../middlewares/validateMiddleware";

const router = express.Router();

// Manager/Staff only - Get all bookings
router.get(
  "/",
  authenticate,
  authorize("Manager", "Staff"),
  getAllBookingsController
);

// Tourist only - Create booking
router.post(
  "/",
  authenticate,
  authorize("Tourist"),
  validateBookingInput,
  createBookingController
);

export default router;
