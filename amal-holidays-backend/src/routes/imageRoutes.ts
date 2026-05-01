import express from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { uploadImage, getImage } from '../controllers/imageController';
import { authenticate } from '../middlewares/authMiddleware';
import { authorize } from '../middlewares/roleMiddleware';

const router = express.Router();
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, uuidv4());
    }
});
const upload = multer({ storage });

router.post('/upload', authenticate, authorize('manager'), upload.single('image'), uploadImage);
router.get('/:uuid', getImage);

export default router;
