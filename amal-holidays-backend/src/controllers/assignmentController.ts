import { Request, Response } from "express";
import * as service from "../services/assignmentService";

export const handleAssignment = async (req: Request, res: Response) => {
  try {
    const { booking_id, staff_id, role } = req.body; 
    const assignment = await service.assignStaff(booking_id, staff_id, role);
    
    res.status(201).json({
      message: `${role} assigned successfully`,
      assignment
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const listStaff = async (req: Request, res: Response) => {
  try {
    const role = req.query.role as string;
    const staff = await service.getAvailableStaff(role);
    res.json(staff);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};