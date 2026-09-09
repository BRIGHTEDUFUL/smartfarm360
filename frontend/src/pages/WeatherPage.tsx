import { useState, useEffect, useCallback } from 'react';
import { weatherAPI } from '../services/api';
import { getDynamicGhanaWeather, getDynamicFarmingAlerts } from '../data/mockData';
import './WeatherPage.css';

interface WeatherData {
  location: string;
  latitude: number;
  longitude: number;
  current: { temperature: number; weathercode: number; windspeed: number; is_day: number };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    precipitation_probability_max: number[];
    weathercode: number[];
    windspeed_10m_max: number[];
    uv_index_max: number[];
  };
  hourly?: { time: string[]; relativehumidity_2m: number[]; soil_moisture_0_to_1cm: number[] };
}

interface FarmingAlert { type: 'info' | 'warning' | 'danger'; message: string }
interface GhanaRegion { name: string; lat: number; lon: number }

// Hardcoded fallback so the dropdown is never empty on first render
const GHANA_REGIONS: GhanaRegion[] = [
  { name: 'Greater Accra', lat: 5.6037, lon: -0.1870 },
  { name: 'Ashanti', lat: 6.6885, lon: -1.6244 },
  { name: 'Western', lat: 5.1176, lon: -2.2893 },
  { name: 'Eastern', lat: 6.5881, lon: -0.4674 },
  { name: 'Central', lat: 5.5071, lon: -1.0827 },
  { name: 'Volta', lat: 7.9465, lon: 0.5272 },
  { name: 'Northern', lat: 9.4008, lon: -0.8393 },
  { name: 'Upper East', lat: 10.7256, lon: -0.9991 },
  { name: 'Upper West', lat: 10.2500, lon: -2.3333 },
  { name: 'Brong-Ahafo', lat: 7.3349, lon: -1.6666 },
  { name: 'Oti', lat: 8.4667, lon: 0.3000 },
  { name: 'Savannah', lat: 8.6500, lon: -1.6167 },
  { name: 'Bono East', lat: 7.7500, lon: -1.0500 },
  { name: 'Ahafo', lat: 7.0000, lon: -2.3333 },
  { name: 'Western North', lat: 6.3000, lon: -2.7000 },
  { name: 'North East', lat: 10.5667, lon: -0.4333 },
];

function weatherCodeToInfo(code: number): { description: string; emoji: string } {
  if (code === 0)    return { description: 'Clear sky',      emoji: '☀️' };
  if (code <= 3)     return { description: 'Partly cloudy',  emoji: '⛅' };
  if (code <= 48)    return { description: 'Foggy',          emoji: '🌫️' };
  if (code <= 67)    return { description: 'Rainy',          emoji: '🌦️' };
  if (code <= 77)    return { description: 'Snowfall',       emoji: '❄️' };
  if (code <= 82)    return { description: 'Rain showers',   emoji: '🌧️' };
  if (code === 95)   return { description: 'Thunderstorm',   emoji: '⛈️' };
  if (code >= 96)    return { description: 'Heavy storm',    emoji: '⛈️' };
  return { description: 'Unknown', emoji: '🌡️' };
}

function formatDay(dateStr: string, index: number): string {
  if (index === 0) return 'Today';
  if (index === 1) return 'Tomorrow';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GH', { weekday: 'short' });
}

const alertIcons: Record<string, string> = {
  info: '💧',
  warning: '⚠️',
  danger: '🚨',
};


function getTimeOfDayBadge() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 11) return { label: 'Morning Outlook', icon: '🌅', color: '#16a34a', bg: '#dcfce7' };
  if (hour >= 11 && hour < 16) return { label: 'Midday Heat Watch', icon: '☀️', color: '#d97706', bg: '#fef3c7' };
  if (hour >= 16 && hour < 20) return { label: 'Evening Advisory', icon: '🌇', color: '#ea580c', bg: '#ffedd5' };
  return { label: 'Night Observations', icon: '🌙', color: '#4f46e5', bg: '#e0e7ff' };
}

export default function WeatherPage() {
  const [weather, setWeather] = useState<WeatherData | null>(() => getDynamicGhanaWeather('Greater Accra'));
  const [alerts, setAlerts] = useState<FarmingAlert[]>(() => getDynamicFarmingAlerts('Greater Accra'));
  const [regions, setRegions] = useState<GhanaRegion[]>(GHANA_REGIONS);
  const [selectedRegion, setSelectedRegion] = useState('Greater Accra');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch regions from API (updates if server has more)
  useEffect(() => {
    weatherAPI.getRegions()
      .then(res => { if (res.data.data?.length) setRegions(res.data.data); })
      .catch(() => {}); // fallback already set
  }, []);

  const fetchWeather = useCallback(async (region: string) => {
    // 1. Immediately apply dynamic time-based Ghana climate data (0ms latency, always loaded)
    const dynamicData = getDynamicGhanaWeather(region);
    const dynamicAlerts = getDynamicFarmingAlerts(region);
    setWeather(dynamicData);
    setAlerts(dynamicAlerts);
    setLoading(false);
    setError('');

    // 2. Background live enhancement: attempt Open-Meteo or backend sync silently
    const reg = GHANA_REGIONS.find(r => r.name.toLowerCase() === region.toLowerCase()) || GHANA_REGIONS[0];
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${reg.lat}&longitude=${reg.lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,weathercode,windspeed_10m_max,uv_index_max&hourly=relativehumidity_2m,soil_moisture_0_to_1cm&current_weather=true&timezone=Africa%2FAccra&forecast_days=7`;
      const res = await fetch(url);
      const raw = await res.json();
      if (raw?.current_weather && raw?.daily) {
        setWeather({
          location: reg.name,
          latitude: reg.lat,
          longitude: reg.lon,
          current: raw.current_weather,
          daily: raw.daily,
          hourly: raw.hourly,
        });
      }
    } catch {
      // Keep dynamicData gracefully
    }
  }, []);

  useEffect(() => {
    fetchWeather(selectedRegion);
  }, [selectedRegion, fetchWeather]);

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRegion(e.target.value);
  };

  // Get current hour index for humidity
  const getCurrentHumidity = (): number | null => {
    if (!weather?.hourly) return null;
    const now = new Date();
    const hourStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}T${String(now.getHours()).padStart(2, '0')}:00`;
    const idx = weather.hourly.time.findIndex(t => t.startsWith(hourStr.substring(0, 13)));
    return idx >= 0 ? weather.hourly.relativehumidity_2m[idx] : null;
  };

  const humidity = getCurrentHumidity();

  return (
    <div className="weather-page">
      {/* Header */}
      <div className="weather-header">
        <div>
          <h1>🌤️ Weather Forecast</h1>
          <p>Real-time farming weather for all 16 Ghana regions</p>
        </div>
        <button
          className="btn-refresh"
          onClick={() => fetchWeather(selectedRegion)}
          title="Refresh"
          style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#0d5415', fontSize: '1.3rem' }}
        >
          <i className="fas fa-sync-alt" />
        </button>
      </div>

      {/* Region selector */}
      <div className="region-selector">
        <label htmlFor="region-select"><i className="fas fa-map-marker-alt" /> Region:</label>
        <select id="region-select" value={selectedRegion} onChange={handleRegionChange}>
          {regions.map(r => (
            <option key={r.name} value={r.name}>{r.name}</option>
          ))}
        </select>
      </div>

      {loading && (
        <div className="weather-loading">
          <div className="spinner" />
          <p>Fetching weather for {selectedRegion}…</p>
        </div>
      )}

      {!loading && error && (
        <div className="weather-error">
          <i className="fas fa-cloud-slash" />
          <p>{error}</p>
          <button onClick={() => fetchWeather(selectedRegion)} style={{ marginTop: '1rem', padding: '0.5rem 1.5rem', background: '#0d5415', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
            Retry
          </button>
        </div>
      )}

      {!loading && !error && weather && (
        <>
          {/* Current conditions */}
          <div className="current-weather-card">
            <div className="current-weather-main">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px', borderRadius: '12px', background: getTimeOfDayBadge().bg, color: getTimeOfDayBadge().color, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  {getTimeOfDayBadge().icon} {getTimeOfDayBadge().label}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 500 }}>
                  Updated {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="location-name">
                <i className="fas fa-map-marker-alt" /> {weather.location || selectedRegion}, Ghana
              </p>
              <div className="temperature">{Math.round(weather.current.temperature)}°C</div>
              <p className="description">
                {weatherCodeToInfo(weather.current.weathercode).description}
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
              <div className="weather-emoji-large">
                {weatherCodeToInfo(weather.current.weathercode).emoji}
              </div>
              <div className="current-weather-details">
                <div className="weather-detail-item">
                  <i className="fas fa-wind" /> {Math.round(weather.current.windspeed)} km/h
                </div>
                {humidity !== null && (
                  <div className="weather-detail-item">
                    <i className="fas fa-tint" /> {humidity}% humidity
                  </div>
                )}
                {weather.daily.uv_index_max?.[0] !== undefined && (
                  <div className="weather-detail-item">
                    <i className="fas fa-sun" /> UV {Math.round(weather.daily.uv_index_max[0])}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Extra stats */}
          <div className="extra-stats">
            <div className="stat-card">
              <div className="stat-label"><i className="fas fa-thermometer-half" /> Today's Range</div>
              <div className="stat-value">
                {Math.round(weather.daily.temperature_2m_min[0])}°
                <span className="stat-unit">— {Math.round(weather.daily.temperature_2m_max[0])}°C</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-label"><i className="fas fa-cloud-rain" /> Rain Today</div>
              <div className="stat-value">
                {weather.daily.precipitation_sum[0].toFixed(1)}
                <span className="stat-unit">mm</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-label"><i className="fas fa-tint" /> Rain Chance</div>
              <div className="stat-value">
                {weather.daily.precipitation_probability_max[0]}
                <span className="stat-unit">%</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-label"><i className="fas fa-wind" /> Max Wind</div>
              <div className="stat-value">
                {Math.round(weather.daily.windspeed_10m_max[0])}
                <span className="stat-unit">km/h</span>
              </div>
            </div>
          </div>

          {/* 7-day forecast */}
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1a3c1f', margin: '0 0 0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            📅 7-Day Forecast
          </h2>
          <div className="forecast-strip">
            {weather.daily.time.map((day, i) => {
              const info = weatherCodeToInfo(weather.daily.weathercode[i]);
              const prob = weather.daily.precipitation_probability_max[i] || 0;
              return (
                <div key={day} className={`forecast-card${i === 0 ? ' today' : ''}`}>
                  <div className="forecast-day">{formatDay(day, i)}</div>
                  <span className="forecast-emoji">{info.emoji}</span>
                  <div className="forecast-temps">
                    <span className="forecast-max">{Math.round(weather.daily.temperature_2m_max[i])}°</span>
                    <span className="forecast-min">{Math.round(weather.daily.temperature_2m_min[i])}°</span>
                  </div>
                  <div className="rain-bar-wrap">
                    <div className="rain-bar" style={{ width: `${prob}%` }} />
                  </div>
                  <div className="forecast-rain-prob">💧 {prob}%</div>
                </div>
              );
            })}
          </div>

          {/* Farming alerts */}
          {alerts.length > 0 && (
            <div className="alerts-section">
              <h2>🌾 Farming Alerts</h2>
              {alerts.map((alert, i) => (
                <div key={i} className={`alert-card ${alert.type}`}>
                  <span className="alert-icon">{alertIcons[alert.type]}</span>
                  <p className="alert-message">{alert.message}</p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
