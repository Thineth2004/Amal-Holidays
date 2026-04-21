import { getTotalRevenueRepo, getMonthlyRevenueRepo, getPopularPackagesRepo, getBookingCountRepo } from "../repositories/reportRepository";

export const getTotalRevenue = async () => {
    return await getTotalRevenueRepo();
};

export const getMonthlyRevenue = async () => {
    return await getMonthlyRevenueRepo();
};

export const getPopularPackages = async () => {
    return await getPopularPackagesRepo();
};

export const getBookingCount = async () => {
    return await getBookingCountRepo();
};

