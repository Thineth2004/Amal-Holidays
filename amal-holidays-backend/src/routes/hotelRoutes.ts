import express from "express";
import {
    getAllHotelsController,
    getHotelByIdController,
    createHotelController,
    updateHotelController,
    deleteHotelController,
    getHotelBookingsController
} from "../controllers/hotelController";
import { authenticate } from "../middlewares/authMiddleware";
import { authorize } from "../middlewares/roleMiddleware";

const router = express.Router();

router.get("/", getAllHotelsController);
router.get("/:id", getHotelByIdController);

router.post("/", authenticate, authorize("Manager"), createHotelController);
router.put("/:id", authenticate, authorize("Manager"), updateHotelController);
router.delete("/:id", authenticate, authorize("Manager"), deleteHotelController);

router.get("/:id/bookings", authenticate, authorize("Manager"), getHotelBookingsController);

export default router;
