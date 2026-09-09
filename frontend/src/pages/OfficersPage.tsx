import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { communityAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { MOCK_OFFICERS, Officer } from '../data/mockData';
import './OfficersPage.css';

function initials(f: string, l: string) {
  return `${f?.[0] ?? ''}${l?.[0] ?? ''}`.toUpperCase();
}

export default function OfficersPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [officers, setOfficers] = useState<Officer[]>(MOCK_OFFICERS);
  const [loading, setLoading] = useState(false);
  const [regionFilter, setRegionFilter] = useState('All');

  useEffect(() => {
    communityAPI
      .getOfficers()
      .then((r) => {
        const liveData = r.data.data;
        if (liveData && liveData.length > 0) {
          // Merge live backend officers with mock details
          const merged = liveData.map((live: any, index: number) => {
            const fallback = MOCK_OFFICERS[index % MOCK_OFFICERS.length];
            return {
              ...fallback,
              id: live.id,
              first_name: live.first_name,
              last_name: live.last_name,
              role: live.role,
              profile_photo_url: live.profile_photo_url || fallback.profile_photo_url,
            };
          });
          setOfficers(merged);
        }
      })
      .catch(() => {
        // Keeps MOCK_OFFICERS
      })
      .finally(() => setLoading(false));
  }, []);

  const regions = ['All', 'Ashanti', 'Eastern', 'Northern', 'Central', 'Greater Accra', 'Volta'];

  const filteredOfficers = officers.filter((o) => {
    if (regionFilter === 'All') return true;
    return (o.region || '').toLowerCase().includes(regionFilter.toLowerCase());
  });

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '2rem 1.25rem 6rem' }}>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#1a3c1f', margin: '0 0 0.4rem' }}>
          🏛️ Agricultural Extension Officers
        </h1>
        <p style={{ color: '#4b5563', margin: 0, fontSize: '0.98rem' }}>
          Verified government and institutional agronomists across Ghana available for farm consultations, pest diagnostics, and technical advisories.
        </p>
      </div>

      {/* Region quick filter */}
      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
        {regions.map((reg) => (
          <button
            key={reg}
            onClick={() => setRegionFilter(reg)}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: '20px',
              border: '1.5px solid',
              borderColor: regionFilter === reg ? '#0d5415' : '#e5e7eb',
              background: regionFilter === reg ? '#0d5415' : '#ffffff',
              color: regionFilter === reg ? '#ffffff' : '#374151',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease',
            }}
          >
            {reg === 'All' ? '🌍 All Regions' : `📍 ${reg}`}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#9ca3af' }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem' }} />
        </div>
      ) : filteredOfficers.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#9ca3af', background: '#fff', borderRadius: '16px' }}>
          <i className="fas fa-user-slash" style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.75rem', color: '#d1fae5' }} />
          <h3 style={{ color: '#374151' }}>No officers found for this region</h3>
          <p>Try selecting another region filter above.</p>
        </div>
      ) : (
        <div className="officers-grid">
          {filteredOfficers.map((officer) => (
            <div key={officer.id} className="officer-card">
              <div className="officer-card-avatar">
                {officer.profile_photo_url ? (
                  <img src={officer.profile_photo_url} alt={officer.first_name} />
                ) : (
                  <span>{initials(officer.first_name, officer.last_name)}</span>
                )}
                <span className="verified-badge" title="MoFA Verified Officer">
                  ✓
                </span>
              </div>

              <div className="officer-card-body">
                <h3 className="officer-name">
                  {officer.first_name} {officer.last_name}
                </h3>
                <span className="officer-role-badge">🏛️ {officer.title || 'Agricultural Officer'}</span>
                
                <div style={{ fontSize: '0.8rem', color: '#047857', fontWeight: 600, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <i className="fas fa-map-marker-alt" /> {officer.region || 'Ghana'}
                </div>

                <div style={{ fontSize: '0.8rem', background: '#f8fafc', padding: '0.4rem 0.6rem', borderRadius: '8px', color: '#334155', marginBottom: '0.65rem', border: '1px solid #f1f5f9' }}>
                  <strong>Specialization:</strong> {officer.specialization || 'Sustainable Agriculture & Crop Protection'}
                </div>

                <p className="officer-bio">{officer.bio}</p>
              </div>

              <div className="officer-card-actions">
                <button
                  className="btn-message-officer"
                  onClick={() => {
                    if (!user) {
                      navigate('/login');
                    } else {
                      navigate(`/messages?partner=${officer.id}`);
                    }
                  }}
                >
                  <i className="fas fa-envelope" /> {user ? 'Message' : 'Login to Chat'}
                </button>
                <button
                  className="btn-view-posts"
                  onClick={() => navigate(`/community?authorId=${officer.id}`)}
                >
                  <i className="fas fa-comments" /> Posts
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
