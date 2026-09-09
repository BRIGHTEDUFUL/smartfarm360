import { query } from '../config/database';
import { WeatherData, FarmingAlert, GhanaRegion } from '../types';
import https from 'https';

export const GHANA_REGIONS: GhanaRegion[] = [
  { name: 'Greater Accra',  lat: 5.6037,  lon: -0.1870 },
  { name: 'Ashanti',        lat: 6.6885,  lon: -1.6244 },
  { name: 'Western',        lat: 5.1176,  lon: -2.2893 },
  { name: 'Eastern',        lat: 6.5881,  lon: -0.4674 },
  { name: 'Central',        lat: 5.5071,  lon: -1.0827 },
  { name: 'Volta',          lat: 7.9465,  lon:  0.5272 },
  { name: 'Northern',       lat: 9.4008,  lon: -0.8393 },
  { name: 'Upper East',     lat: 10.7256, lon: -0.9991 },
  { name: 'Upper West',     lat: 10.2500, lon: -2.3333 },
  { name: 'Brong-Ahafo',    lat: 7.3349,  lon: -1.6666 },
  { name: 'Oti',            lat: 8.4667,  lon:  0.3000 },
  { name: 'Savannah',       lat: 8.6500,  lon: -1.6167 },
  { name: 'Bono East',      lat: 7.7500,  lon: -1.0500 },
  { name: 'Ahafo',          lat: 7.0000,  lon: -2.3333 },
  { name: 'Western North',  lat: 6.3000,  lon: -2.7000 },
  { name: 'North East',     lat: 10.5667, lon: -0.4333 },
];

// WMO weather code to description + emoji
export function weatherCodeToInfo(code: number): { description: string; emoji: string } {
  if (code === 0)           return { description: 'Clear sky',           emoji: '☀️' };
  if (code <= 3)            return { description: 'Partly cloudy',       emoji: '⛅' };
  if (code <= 48)           return { description: 'Foggy',               emoji: '🌫️' };
  if (code <= 67)           return { description: 'Drizzle / Rain',      emoji: '🌦️' };
  if (code <= 77)           return { description: 'Snowfall',            emoji: '❄️' };
  if (code <= 82)           return { description: 'Rain showers',        emoji: '🌧️' };
  if (code === 95)          return { description: 'Thunderstorm',        emoji: '⛈️' };
  if (code >= 96)           return { description: 'Thunderstorm + hail', emoji: '⛈️' };
  return { description: 'Unknown', emoji: '🌡️' };
}

function fetchJson(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

export class WeatherService {
  static async getWeather(lat: number, lon: number, locationName = ''): Promise<WeatherData> {
    const key = `${lat.toFixed(4)},${lon.toFixed(4)}`;

    // Check 1-hour cache
    const cached = await query(
      `SELECT weather_data FROM weather_cache
       WHERE location_key = ? AND fetched_at > datetime('now', '-1 hour')`,
      [key]
    );
    if (cached.rows.length > 0) {
      return JSON.parse((cached.rows[0] as any).weather_data) as WeatherData;
    }

    // Fetch from Open-Meteo
    const url =
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${lat}&longitude=${lon}` +
      `&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,weathercode,windspeed_10m_max,uv_index_max` +
      `&hourly=relativehumidity_2m,soil_moisture_0_to_1cm` +
      `&current_weather=true` +
      `&timezone=Africa%2FAccra` +
      `&forecast_days=7`;

    const raw = await fetchJson(url);

    const weatherData: WeatherData = {
      location: locationName,
      latitude: lat,
      longitude: lon,
      current: raw.current_weather,
      daily: raw.daily,
      hourly: raw.hourly,
    };

    // Upsert cache
    await query(
      `INSERT INTO weather_cache (location_key, weather_data, fetched_at)
       VALUES (?, ?, datetime('now'))
       ON CONFLICT(location_key) DO UPDATE SET weather_data = excluded.weather_data, fetched_at = excluded.fetched_at`,
      [key, JSON.stringify(weatherData)]
    );

    return weatherData;
  }

  static async getWeatherByRegion(regionName: string): Promise<WeatherData> {
    const region = GHANA_REGIONS.find(
      (r) => r.name.toLowerCase() === regionName.toLowerCase()
    );
    if (!region) throw new Error(`Unknown Ghana region: ${regionName}`);
    return this.getWeather(region.lat, region.lon, region.name);
  }

  static getFarmingAlerts(data: WeatherData): FarmingAlert[] {
    const alerts: FarmingAlert[] = [];
    const { daily } = data;
    if (!daily) return alerts;

    // Sum precipitation for next 3 days
    const next3Rain = (daily.precipitation_sum || []).slice(0, 3).reduce((a, b) => a + b, 0);
    const maxRainProb = Math.max(...(daily.precipitation_probability_max || []).slice(0, 3));
    const maxTemp = Math.max(...(daily.temperature_2m_max || []).slice(0, 3));
    const maxWind = Math.max(...(daily.windspeed_10m_max || []).slice(0, 3));

    if (next3Rain < 2) {
      alerts.push({ type: 'warning', message: 'No significant rain expected in the next 3 days. Consider irrigating your crops.' });
    }
    if (maxRainProb > 70) {
      alerts.push({ type: 'info', message: 'Heavy rain is likely. You can hold off on irrigation to save water.' });
    }
    if (maxTemp > 35) {
      alerts.push({ type: 'danger', message: `High heat expected (up to ${Math.round(maxTemp)}°C). Water crops early morning or late evening.` });
    }
    if (maxWind > 40) {
      alerts.push({ type: 'warning', message: `Strong winds forecast (up to ${Math.round(maxWind)} km/h). Protect young seedlings and secure farm equipment.` });
    }
    if (next3Rain > 50) {
      alerts.push({ type: 'danger', message: 'Very heavy rainfall expected. Check drainage and watch for flooding in low-lying fields.' });
    }

    if (alerts.length === 0) {
      alerts.push({ type: 'info', message: 'Weather conditions look favorable for farming this week. Keep monitoring daily.' });
    }

    return alerts;
  }
}
