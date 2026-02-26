import express from 'express';
import { getAllUsers, getAllPredictions, getStats, deleteUser } from '../controllers/adminController.js';
import { protect } from '../middleware/auth.js';
import { adminOnly } from '../middleware/admin.js';

const router = express.Router();

router.use(protect, adminOnly);

router.get('/users', getAllUsers);
router.get('/predictions', getAllPredictions);
router.get('/stats', getStats);
router.delete('/users/:id', deleteUser);

export default router;
