import * as repo from "../repositories/destinationRepository";

export const fetchAllDestinations = async () => {
  // Add any business logic or data transforms here if needed before returning to controller
  return await repo.getAllDestinationsRepo();
};

export const addNewDestination = async (
  name: string, 
  location: string, 
  description: string, 
  imageUrl: string
) => {
  if (!name || !location) {
    throw new Error("Name and location fields are required.");
  }
  return await repo.createDestinationRepo(name, location, description, imageUrl);
};