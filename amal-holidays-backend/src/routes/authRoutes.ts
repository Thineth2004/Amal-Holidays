import express from "express";
import { register, login, staffManagerLogin } from "../controllers/authController";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/staff-login", staffManagerLogin);

export default router;