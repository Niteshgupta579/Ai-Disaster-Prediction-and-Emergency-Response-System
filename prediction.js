import express from 'express';
import { predictFlood, predictEarthquake, getWeather, getUserPredictions } from '../controllers/predictionController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/flood', protect, predictFlood);
router.post('/earthquake', protect, predictEarthquake);
router.get('/weather', protect, getWeather);
router.get('/history', protect, getUserPredictions);

export default router;
