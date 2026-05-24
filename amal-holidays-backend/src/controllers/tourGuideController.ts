import { Request, Response } from "express";
import * as service from "../services/staffService";

export const getAllTourGuidesController = async (req: Request, res: Response) => {
    try {
        const guides = await service.getStaffByRole("Guide");
        res.json(guides);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getTourGuideByIdController = async (req: Request, res: Response) => {
    try {
        const guide = await service.getStaffById(Number(req.params.id));
        if (!guide || guide.role !== "Guide") return res.status(404).json({ message: "Tour Guide not found" });
        res.json(guide);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const createTourGuideController = async (req: Request, res: Response) => {
    try {
        const guide = await service.createStaff(req.body, "Guide");
        res.status(201).json(guide);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const updateTourGuideController = async (req: Request, res: Response) => {
    try {
        const guide = await service.updateStaff(Number(req.params.id), req.body);
        res.json(guide);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteTourGuideController = async (req: Request, res: Response) => {
    try {
        const deletedGuide = await service.deleteStaff(Number(req.params.id));
        res.json({ message: "Tour Guide deleted successfully", guide: deletedGuide });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const getTourGuideBookingsController = async (req: Request, res: Response) => {
    try {
        const bookings = await service.getGuideBookings(Number(req.params.id));
        res.json(bookings);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
