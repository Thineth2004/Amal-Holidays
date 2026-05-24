import * as repo from "../repositories/destinationRepository";

export const fetchAllDestinations = async () => {
  return await repo.getAllDestinationsRepo();
};

export const addNewDestination = async (
  name: string,
  location: string,
  description: string,
  image_uuid: string
) => {
  if (!name || !location) {
    throw new Error("Name and location fields are required.");
  }
  return await repo.createDestinationRepo(name, location, description, image_uuid);
};

export const updateDestination = async (
  id: number,
  name: string,
  location: string,
  description: string,
  image_uuid?: string
) => {
  if (!name || !location) {
    throw new Error("Name and location fields are required.");
  }
  return await repo.updateDestinationRepo(id, name, location, description, image_uuid);
};

export const deleteDestination = async (id: number) => {
  return await repo.deleteDestinationRepo(id);
};
