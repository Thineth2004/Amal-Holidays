import { Request, Response } from "express";
import * as service from "../services/destinationService";

export const getDestinations = async (req: Request, res: Response) => {
  try {
    const data = await service.fetchAllDestinations();
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createDestination = async (req: Request, res: Response) => {
  try {
    const { name, location, description, image_uuid } = req.body;
    const data = await service.addNewDestination(name, location, description, image_uuid);
    res.status(201).json(data);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateDestination = async (req: Request, res: Response) => {
  try {
    const { name, location, description, image_uuid } = req.body;
    const data = await service.updateDestination(
      Number(req.params.id),
      name,
      location,
      description,
      image_uuid
    );
    res.json(data);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteDestination = async (req: Request, res: Response) => {
  try {
    const data = await service.deleteDestination(Number(req.params.id));
    res.json({ message: "Destination deleted successfully", destination: data });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
