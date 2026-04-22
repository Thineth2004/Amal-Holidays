import express from "express";
import * as controller from "../controllers/assignmentController";
import { authenticate } from "../middlewares/authMiddleware";
import { authorize } from "../middlewares/roleMiddleware";

const router = express.Router();

router.get("/staff", authenticate, authorize("Manager"), controller.listStaff);

router.post("/assign", authenticate, authorize("Manager"), controller.handleAssignment);

export default router;