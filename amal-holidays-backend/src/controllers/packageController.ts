import { Request, Response } from "express";
import * as service from "../services/packageService";

// Manager 
export const createPackageController =  async (req: Request, res: Response) => {
    try {
        const pkg = await service.createPackage(req.body);
        res.status(201).json(pkg);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

// Manager
export const getAllPackagesController = async (req: Request, res: Response) => {
    const packages = await service.getAllPackages();
    res.json(packages);
};

// All users
export const getAvailablePackagesController = async (req: Request, res: Response) => {
    const packages = await service.getAvailablePackages();
    res.json(packages);
};

// Get single
export const getPackageController = async (req: Request, res: Response) => {
    const pkg = await service.getPackageById(Number(req.params.id));
    res.json(pkg);
};

// Manager
export const updatePackageController = async (req: Request, res: Response) => {
    try {
        const pkg = await service.updatePackage(Number(req.params.id), req.body);
        res.json(pkg);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

// Manager
export const deletePackageController = async (req: Request, res: Response) => {
    try {
        const deletedPkg = await service.deletePackage(Number(req.params.id));
        res.json({ message: "Package deleted successfully", package: deletedPkg });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};
