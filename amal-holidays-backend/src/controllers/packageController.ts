import { Request, Response } from "express";
import {
    createPackage,
    getAllPackages,
    getAvailablePackages,
    getPackageById,
} from "../services/packageService";

// Manager 
export const createTourPackageController =  async (req: Request, res: Response) => {
    try {
        const pkg = await createPackage(req.body);
        res.status(201).json(pkg);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

// Manager
export const getAllPackagesController = async (req: Request, res: Response) => {
    const packages = await getAllPackages();
    res.json(packages);
};

// All users
export const getAvailablePackagesController = async (req: Request, res: Response) => {
    const packages = await getAvailablePackages();
    res.json(packages);
};

// Get single
export const getPackageController = async (req: Request, res: Response) => {
    const pkg = await getPackageById(Number(req.params.id));
    res.json(pkg);
};

