import { Request, Response } from "express";
import * as repo from "../repositories/destinationRepository";

export const getDestinations = async (req: Request, res: Response) => {
  try {
    const data = await repo.getAllDestinationsRepo();
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createDestination = async (req: Request, res: Response) => {
  try {
    const { name, location, description } = req.body;
    const data = await repo.createDestinationRepo(name, location, description);
    res.status(201).json(data);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};