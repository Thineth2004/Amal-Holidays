import express from "express";
import { authenticate } from "../middlewares/authMiddleware";
import { authorize } from "../middlewares/roleMiddleware";

const router = express.Router();

// Only Manager
router.get(
    "/manager",
    authenticate,
    authorize("Manager"),
    (req, res) => {
        res.json({ message: "Welcome Manager" });
    }
);

// Manager + Staff
router.get(
    "/staff",
    authenticate,
    authorize("Manager", "Staff"),
    (req, res) => {
        res.json({ message: "Welcome Staff or Manager" });
    }
);

router.get(
    "/profile",
    authenticate,
    (req: any, res) => {
        res.json({ user: req.user });
    }
);

export default router;