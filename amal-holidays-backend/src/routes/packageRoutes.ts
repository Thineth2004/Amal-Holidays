import express from "express";
import {
    createPackageController,
    getAllPackagesController,
    getAvailablePackagesController,
    getPackageController,
    updatePackageController,
    deletePackageController,
} from "../controllers/packageController";

import { authenticate } from "../middlewares/authMiddleware";
import { authorize } from "../middlewares/roleMiddleware";

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
    getAvailablePackagesController
);

// Get by ID
router.get(
    "/:id",
    getPackageController
);

// Manager only
router.put(
    "/:id",
    authenticate,
    authorize("Manager"),
    updatePackageController
);

// Manager only
router.delete(
    "/:id",
    authenticate,
    authorize("Manager"),
    deletePackageController
);

export default router;
