import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';

export const uploadImage = (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    res.status(201).json({ uuid: req.file.filename });
};

export const getImage = (req: Request, res: Response) => {
    const { uuid } = req.params;
    const filePath = path.join(__dirname, '../../uploads', uuid);
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: 'Image not found' });
    }
    res.sendFile(filePath);
};
