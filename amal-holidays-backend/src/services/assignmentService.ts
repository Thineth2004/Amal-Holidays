import * as repo from "../repositories/assignmentRepository";

export const assignStaff = async (booking_id: number, staff_id: number, role: 'Guide' | 'Driver') => {
  const travelDate = await repo.getBookingDateRepo(booking_id);
  if (!travelDate) throw new Error("Booking not found");

  const isAvailable = await repo.checkStaffAvailabilityRepo(staff_id, travelDate, role);
  
  if (!isAvailable) {
    throw new Error(`${role} is already assigned to another tour on ${travelDate}`);
  }

  if (role === 'Guide') {
    return await repo.assignGuideRepo(booking_id, staff_id);
  } else {
    return await repo.assignDriverRepo(booking_id, staff_id);
  }
};

export const getAvailableStaff = async (role: string) => {
  return await repo.getStaffByRoleRepo(role);
};