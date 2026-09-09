import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { weatherAPI } from '../services/api';

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
  const [current, setCurrent] = useState<CurrentWeather | null>(null);
  const [rain, setRain] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setFailed(false);
    weatherAPI.get({ region })
      .then(res => {
        if (cancelled) return;
        const data = res.data.data;
        if (data?.current) {
          setCurrent(data.current);
          setRain(data.daily?.precipitation_probability_max?.[0] ?? 0);
        }
      })
      .catch(() => { if (!cancelled) setFailed(true); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [region]);

  if (loading) {
    return (
      <div style={{ background: '#f0fdf4', border: '1.5px solid #d1fae5', borderRadius: '14px', padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#9ca3af', fontSize: '0.85rem' }}>
        <i className="fas fa-spinner fa-spin" /> Loading weather…
      </div>
    );
  }

  if (failed || !current) {
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
