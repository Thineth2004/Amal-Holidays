import {
    createPackageRepo,
    getAllPackagesRepo,
    getAvailablePackagesRepo,
    getPackageByIdRepo,
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
