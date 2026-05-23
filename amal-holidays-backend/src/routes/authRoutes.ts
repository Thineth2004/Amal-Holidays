import express from "express";
import { register, login, staffManagerLogin, getAllUsersController } from "../controllers/authController";
import { authenticate } from "../middlewares/authMiddleware";
import { authorize } from "../middlewares/roleMiddleware";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/staff-login", staffManagerLogin);

// Manager only - Get all users
router.get(
    "/users/all",
    authenticate,
    authorize("Manager", "Staff"),
    getAllUsersController
);

export default router;
