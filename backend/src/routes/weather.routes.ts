import { Router } from 'express';
import { WeatherController } from '../controllers/weather.controller';

const router = Router();

router.get('/', WeatherController.getWeather);
router.get('/regions', WeatherController.getRegions);
router.get('/alerts', WeatherController.getAlerts);

export default router;
