import { Request, Response } from "express";
import * as service from "../services/inquiryService";

export const createInquiryController = async (req: Request, res: Response) => {
    try {
        const inquiry = await service.createInquiry(req.body);
        res.status(201).json(inquiry);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const getAllInquiriesController = async (req: Request, res: Response) => {
    try {
        const inquiries = await service.getAllInquiries();
        res.json(inquiries);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const markAsReviewedController = async (req: Request, res: Response) => {
    try {
        const inquiry = await service.markAsReviewed(Number(req.params.id));
        if (!inquiry) {
            return res.status(404).json({ message: "Inquiry not found" });
        }
        res.json(inquiry);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};
