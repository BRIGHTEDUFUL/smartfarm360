import { Request, Response } from 'express';
import { WeatherService, GHANA_REGIONS } from '../services/weather.service';

export class WeatherController {
  // GET /api/weather?lat=&lon= OR ?region=
  static async getWeather(req: Request, res: Response): Promise<void> {
    try {
      const { lat, lon, region } = req.query;

      let weatherData;
      if (region) {
        weatherData = await WeatherService.getWeatherByRegion(region as string);
      } else if (lat && lon) {
        weatherData = await WeatherService.getWeather(
          parseFloat(lat as string),
          parseFloat(lon as string)
        );
      } else {
        // Default to Greater Accra
        weatherData = await WeatherService.getWeatherByRegion('Greater Accra');
      }

      res.json({ success: true, data: weatherData });
    } catch (err: any) {
      if (err.message?.includes('Unknown Ghana region')) {
        res.status(400).json({ success: false, error: { code: 'INVALID_REGION', message: err.message } });
      } else {
        console.error('Weather fetch error:', err);
        res.status(500).json({ success: false, error: { code: 'WEATHER_FETCH_FAILED', message: 'Failed to fetch weather data' } });
      }
    }
  }

  // GET /api/weather/regions
  static async getRegions(_req: Request, res: Response): Promise<void> {
    res.json({ success: true, data: GHANA_REGIONS });
  }

  // GET /api/weather/alerts?lat=&lon= OR ?region=
  static async getAlerts(req: Request, res: Response): Promise<void> {
    try {
      const { lat, lon, region } = req.query;

      let weatherData;
      if (region) {
        weatherData = await WeatherService.getWeatherByRegion(region as string);
      } else if (lat && lon) {
        weatherData = await WeatherService.getWeather(
          parseFloat(lat as string),
          parseFloat(lon as string)
        );
      } else {
        weatherData = await WeatherService.getWeatherByRegion('Greater Accra');
      }

      const alerts = WeatherService.getFarmingAlerts(weatherData);
      res.json({ success: true, data: alerts });
    } catch (err) {
      console.error('Alerts error:', err);
      res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to get farming alerts' } });
    }
  }
}
