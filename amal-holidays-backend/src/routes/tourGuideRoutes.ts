import express from "express";
import {
    getAllTourGuidesController,
    getTourGuideByIdController,
    createTourGuideController,
    updateTourGuideController,
    deleteTourGuideController,
    getTourGuideBookingsController
} from "../controllers/tourGuideController";
import { authenticate } from "../middlewares/authMiddleware";
import { authorize } from "../middlewares/roleMiddleware";

const router = express.Router();

router.get("/", getAllTourGuidesController);
router.get("/:id", getTourGuideByIdController);

router.post("/", authenticate, authorize("Manager"), createTourGuideController);
router.put("/:id", authenticate, authorize("Manager"), updateTourGuideController);
router.delete("/:id", authenticate, authorize("Manager"), deleteTourGuideController);

router.get("/:id/bookings", authenticate, authorize("Manager"), getTourGuideBookingsController);

export default router;
