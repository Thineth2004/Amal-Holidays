import express from "express";
import { getDestinations, createDestination, updateDestination, deleteDestination } from "../controllers/destinationController";
import { authenticate } from "../middlewares/authMiddleware";
import { authorize } from "../middlewares/roleMiddleware";

const router = express.Router();

router.get("/", getDestinations);
router.post("/", authenticate, authorize("Manager"), createDestination);
router.put("/:id", authenticate, authorize("Manager"), updateDestination);
router.delete("/:id", authenticate, authorize("Manager"), deleteDestination);

export default router;
