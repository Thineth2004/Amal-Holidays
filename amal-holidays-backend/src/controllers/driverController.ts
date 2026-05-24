import { Request, Response } from "express";
import * as service from "../services/staffService";

export const getAllDriversController = async (req: Request, res: Response) => {
    try {
        const drivers = await service.getStaffByRole("Driver");
        res.json(drivers);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getDriverByIdController = async (req: Request, res: Response) => {
    try {
        const driver = await service.getStaffById(Number(req.params.id));
        if (!driver || driver.role !== "Driver") return res.status(404).json({ message: "Driver not found" });
        res.json(driver);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const createDriverController = async (req: Request, res: Response) => {
    try {
        const driver = await service.createStaff(req.body, "Driver");
        res.status(201).json(driver);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const updateDriverController = async (req: Request, res: Response) => {
    try {
        const driver = await service.updateStaff(Number(req.params.id), req.body);
        res.json(driver);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteDriverController = async (req: Request, res: Response) => {
    try {
        const deletedDriver = await service.deleteStaff(Number(req.params.id));
        res.json({ message: "Driver deleted successfully", driver: deletedDriver });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const getDriverBookingsController = async (req: Request, res: Response) => {
    try {
        const bookings = await service.getDriverBookings(Number(req.params.id));
        res.json(bookings);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
