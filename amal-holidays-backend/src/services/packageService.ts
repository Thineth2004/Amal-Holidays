import {
    createPackageRepo,
    getAllPackagesRepo,
    getAvailablePackagesRepo,
    getPackageByIdRepo,
    updatePackageRepo,
} from "../repositories/tourRepository";

export const createPackage = async (data: any) => {
    return await createPackageRepo(data);
};

export const getAllPackages = async () => {
    return await getAllPackagesRepo();
};

export const getAvailablePackages = async () => {
    return await getAvailablePackagesRepo();
};

export const getPackageById = async (id: number) => {
    return await getPackageByIdRepo(id);
};

export const updatePackage = async (id: number, data: any) => {
    return await updatePackageRepo(id, data);
};
