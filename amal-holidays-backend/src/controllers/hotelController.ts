import { Request, Response } from "express";
import * as service from "../services/hotelService";

export const getAllHotelsController = async (req: Request, res: Response) => {
    try {
        const hotels = await service.getAllHotels();
        res.json(hotels);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getHotelByIdController = async (req: Request, res: Response) => {
    try {
        const hotel = await service.getHotelById(Number(req.params.id));
        if (!hotel) return res.status(404).json({ message: "Hotel not found" });
        res.json(hotel);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const createHotelController = async (req: Request, res: Response) => {
    try {
        const hotel = await service.createHotel(req.body);
        res.status(201).json(hotel);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const updateHotelController = async (req: Request, res: Response) => {
    try {
        const hotel = await service.updateHotel(Number(req.params.id), req.body);
        res.json(hotel);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteHotelController = async (req: Request, res: Response) => {
    try {
        const deletedHotel = await service.deleteHotel(Number(req.params.id));
        res.json({ message: "Hotel deleted successfully", hotel: deletedHotel });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const getHotelBookingsController = async (req: Request, res: Response) => {
    try {
        const bookings = await service.getHotelBookings(Number(req.params.id));
        res.json(bookings);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
