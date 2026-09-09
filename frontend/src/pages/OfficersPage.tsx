import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { communityAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import './OfficersPage.css';

interface Officer {
  id: number;
  first_name: string;
  last_name: string;
  role: string;
  profile_photo_url: string | null;
  created_at: string;
}

function initials(f: string, l: string) {
  return `${f?.[0] ?? ''}${l?.[0] ?? ''}`.toUpperCase();
}

export default function OfficersPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    communityAPI.getOfficers()
      .then(r => setOfficers(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1rem 6rem' }}>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1a3c1f', margin: '0 0 0.25rem' }}>🏛️ Agricultural Officers</h1>
        <p style={{ color: '#6b7280', margin: 0 }}>Verified agricultural experts you can connect with for farming advice and guidance</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#9ca3af' }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem' }} />
        </div>
      ) : officers.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#9ca3af' }}>
          <i className="fas fa-user-slash" style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.75rem', color: '#d1fae5' }} />
          <h3 style={{ color: '#374151' }}>No officers registered yet</h3>
        </div>
      ) : (
        <div className="officers-grid">
          {officers.map(officer => (
            <div key={officer.id} className="officer-card">
              <div className="officer-card-avatar">
                {officer.profile_photo_url
                  ? <img src={officer.profile_photo_url} alt={officer.first_name} />
                  : <span>{initials(officer.first_name, officer.last_name)}</span>
                }
                <span className="verified-badge" title="Verified Officer">✓</span>
              </div>

              <div className="officer-card-body">
                <h3 className="officer-name">{officer.first_name} {officer.last_name}</h3>
                <span className="officer-role-badge">🏛️ Agricultural Officer</span>
                <p className="officer-bio">
                  Expert in sustainable farming practices, crop disease management, and agricultural development for Ghanaian farmers.
                </p>
              </div>

              <div className="officer-card-actions">
                {user ? (
                  <button
                    className="btn-message-officer"
                    onClick={() => navigate(`/messages?partner=${officer.id}`)}
                  >
                    <i className="fas fa-envelope" /> Send Message
                  </button>
                ) : (
                  <button
                    className="btn-message-officer"
                    onClick={() => navigate('/login')}
                  >
                    <i className="fas fa-sign-in-alt" /> Login to Message
                  </button>
                )}
                <button
                  className="btn-view-posts"
                  onClick={() => navigate(`/community?authorId=${officer.id}`)}
                >
                  <i className="fas fa-comments" /> View Posts
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
