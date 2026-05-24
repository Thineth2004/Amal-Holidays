import express from "express";
import {
    createInquiryController,
    getAllInquiriesController,
    markAsReviewedController
} from "../controllers/inquiryController";

const router = express.Router();

router.post("/", createInquiryController);
router.get("/", getAllInquiriesController);
router.patch("/:id/review", markAsReviewedController);

export default router;
