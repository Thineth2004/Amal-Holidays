import { Request, Response } from "express";
import { getTotalRevenue, getMonthlyRevenue, getPopularPackages, getBookingCount } from "../services/reportService";

export const totalRevenueController = async (req: Request, res: Response) => {
    const data = await getTotalRevenue();
    res.json(data);
};

export const monthlyRevenueController = async (req: Request, res: Response) => {
    const data = await getMonthlyRevenue();
    res.json(data);
};

export const popularPackagesController = async (req: Request, res: Response) => {
    const data = await getPopularPackages();
    res.json(data);
};

export const bookingCountController = async (req: Request, res: Response) => {
    const data = await getBookingCount();
    res.json(data);
};

