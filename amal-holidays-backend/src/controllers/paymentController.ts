import { Request, Response } from "express";
import { createPayment } from "../services/paymentService";

export const createPaymentController = async (req: any, res: Response) => {
    try {
        const payment = await createPayment(req.body);

        res.status(201).json({ message: "Payment successful", payment, });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    };
};