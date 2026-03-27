import express from "express";
import {
    createPackageController,
    getAllPackagesController,
    getAvailablePackagesController,
    getPackageController,
} from "../controllers/packageController";

import { authenticate } from "../middlewares/authMiddleware";
import { authorize } from "../middlewares/roleMiddleware";
import { getAvailablePackages, getPackageById } from "../services/packageService";

const router = express.Router();

// Manager only
router.post(
    "/",
    authenticate,
    authorize("Manager"),
    createPackageController
);

// Manager only
router.get(
    "/all",
    authenticate,
    authorize("Manager"),
    getAllPackagesController
);

// All logged users
router.get(
    "/available",
    authenticate,
    getAvailablePackagesController
);

// Get by ID
router.get(
    "/:id",
    authenticate,
    getPackageController
);

export default router;