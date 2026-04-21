import express from "express";
import { getDestinations, createDestination } from "../controllers/destinationController";
import { authenticate } from "../middlewares/authMiddleware";
import { authorize } from "../middlewares/roleMiddleware";

const router = express.Router();

router.get("/", authenticate, getDestinations);
router.post("/", authenticate, authorize("Manager"), createDestination);

export default router;