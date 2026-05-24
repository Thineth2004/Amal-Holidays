import * as userRepository from "../repositories/userRepository";
import * as staffBookingRepository from "../repositories/staffBookingRepository";
import bcrypt from "bcrypt";

export const getStaffByRole = async (role: string) => {
    return await userRepository.getUsersByRole(role);
};

export const getStaffById = async (id: number) => {
    return await userRepository.getUserById(id);
};

export const createStaff = async (data: any, role: string) => {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return await userRepository.createStaff(
        data.name,
        data.email,
        hashedPassword,
        role,
        data.phone,
        data.price_per_day,
        data.image_uuid
    );
};

export const updateStaff = async (id: number, data: any) => {
    return await userRepository.updateStaff(
        id,
        data.name,
        data.email,
        data.phone,
        data.price_per_day,
        data.image_uuid
    );
};

export const deleteStaff = async (id: number) => {
    return await userRepository.deleteUser(id);
};

export const getDriverBookings = async (id: number) => {
    return await staffBookingRepository.getDriverBookings(id);
};

export const getGuideBookings = async (id: number) => {
    return await staffBookingRepository.getGuideBookings(id);
};
