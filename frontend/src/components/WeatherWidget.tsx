import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDynamicGhanaWeather } from '../data/mockData';


interface CurrentWeather {
  temperature: number;
  weathercode: number;
  windspeed: number;
}

function weatherCodeToInfo(code: number): { emoji: string; description: string } {
  if (code === 0)  return { emoji: '☀️', description: 'Clear' };
  if (code <= 3)   return { emoji: '⛅', description: 'Cloudy' };
  if (code <= 48)  return { emoji: '🌫️', description: 'Foggy' };
  if (code <= 67)  return { emoji: '🌦️', description: 'Rainy' };
  if (code <= 82)  return { emoji: '🌧️', description: 'Showers' };
  if (code >= 95)  return { emoji: '⛈️', description: 'Storm' };
  return { emoji: '🌡️', description: 'Unknown' };
}

export default function WeatherWidget({ region = 'Greater Accra' }: { region?: string }) {
  const navigate = useNavigate();
  const [current, setCurrent] = useState<CurrentWeather | null>({ temperature: 28, weathercode: 1, windspeed: 14 });
  const [rain, setRain] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const dynamicData = getDynamicGhanaWeather(region);
    if (!cancelled) {
      setCurrent(dynamicData.current);
      setRain(dynamicData.daily?.precipitation_probability_max?.[0] ?? 15);
      setLoading(false);
    }

    // Optional background sync with live Open-Meteo
    const syncLive = async () => {
      try {
        const url = 'https://api.open-meteo.com/v1/forecast?latitude=5.6037&longitude=-0.1870&current_weather=true&daily=precipitation_probability_max&timezone=Africa%2FAccra';
        const res = await fetch(url);
        const raw = await res.json();
        if (raw?.current_weather && !cancelled) {
          setCurrent(raw.current_weather);
          setRain(raw.daily?.precipitation_probability_max?.[0] ?? 10);
        }
      } catch {}
    };
    syncLive();

    return () => { cancelled = true; };
  }, [region]);

  if (loading) {
    return (
      <div style={{ background: '#f0fdf4', border: '1.5px solid #d1fae5', borderRadius: '14px', padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#9ca3af', fontSize: '0.85rem' }}>
        <i className="fas fa-spinner fa-spin" /> Loading weather…
      </div>
    );
  }

  if (!current) {
    return (
      <div
        onClick={() => navigate('/weather')}
        style={{ background: '#f9fafb', border: '1.5px solid #e5e7eb', borderRadius: '14px', padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#9ca3af', fontSize: '0.88rem', cursor: 'pointer' }}
      >
        <span style={{ fontSize: '1.5rem' }}>⚠️</span>
        <span>Weather unavailable — tap to try again</span>
      </div>
    );
  }

  const info = weatherCodeToInfo(current.weathercode);

  return (
    <div
      onClick={() => navigate('/weather')}
      style={{
        background: 'linear-gradient(135deg, #0d5415 0%, #1a7a28 100%)',
        borderRadius: '14px',
        padding: '1rem 1.25rem',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        color: '#fff',
        transition: 'transform 0.15s, box-shadow 0.15s',
      }}
      onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
      onMouseLeave={e => (e.currentTarget.style.transform = 'none')}
      title="Click to see full forecast"
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && navigate('/weather')}
    >
      <span style={{ fontSize: '2.2rem', lineHeight: 1 }}>{info.emoji}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 800, lineHeight: 1 }}>{Math.round(current.temperature)}°C</div>
        <div style={{ fontSize: '0.8rem', opacity: 0.85, marginTop: '0.15rem' }}>{info.description} · {region}</div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: '0.72rem', opacity: 0.8 }}>Rain chance</div>
        <div style={{ fontSize: '1rem', fontWeight: 700 }}>💧 {rain}%</div>
      </div>
    </div>
  );
}
