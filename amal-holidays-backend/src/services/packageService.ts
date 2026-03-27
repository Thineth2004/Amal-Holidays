import {
    createTourPackage,
    getAllTourPackages,
    getAvailableTourPackages,
    getTourPackageById,
} from "../repositories/tourRepository";

export const createTour = async (data: any) => {
    return await createTourPackage(data);
};

export const getAllTours = async () => {
    return await getAllTourPackages();
};

export const getAvailableTours = async () => {
    return await getAvailableTourPackages();
};

export const getTourPackage = async (id: number) => {
    return await getTourPackageById(id);
};
