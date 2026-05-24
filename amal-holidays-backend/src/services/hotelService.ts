import * as repository from "../repositories/hotelRepository";

export const getAllHotels = async () => {
    return await repository.getHotelWithPrice();
};

export const getHotelById = async (id: number) => {
    return await repository.getHotelById(id);
};

export const createHotel = async (data: any) => {
    return await repository.createHotel(
        data.name,
        data.location,
        data.contact_no,
        data.rating,
        data.description,
        data.image_uuid,
        data.price_per_night
    );
};

export const updateHotel = async (id: number, data: any) => {
    return await repository.updateHotel(
        id,
        data.name,
        data.location,
        data.contact_no,
        data.rating,
        data.description,
        data.image_uuid,
        data.price_per_night
    );
};

export const deleteHotel = async (id: number) => {
    return await repository.deleteHotel(id);
};

export const getHotelBookings = async (id: number) => {
    return await repository.getHotelBookings(id);
};
