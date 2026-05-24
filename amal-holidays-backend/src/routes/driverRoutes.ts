import express from "express";
import {
    getAllDriversController,
    getDriverByIdController,
    createDriverController,
    updateDriverController,
    deleteDriverController,
    getDriverBookingsController
} from "../controllers/driverController";
import { authenticate } from "../middlewares/authMiddleware";
import { authorize } from "../middlewares/roleMiddleware";

const router = express.Router();

router.get("/", getAllDriversController);
router.get("/:id", getDriverByIdController);

router.post("/", authenticate, authorize("Manager"), createDriverController);
router.put("/:id", authenticate, authorize("Manager"), updateDriverController);
router.delete("/:id", authenticate, authorize("Manager"), deleteDriverController);

router.get("/:id/bookings", authenticate, authorize("Manager"), getDriverBookingsController);

export default router;
