import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { communityAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import './CommunityPage.css';

interface Post {
  id: number; author_id: number; title: string; content: string; category: string;
  likes_count: number; replies_count: number; is_pinned: number;
  created_at: string;
  author_first_name: string; author_last_name: string;
  author_role: string; author_profile_photo_url: string | null;
  user_liked?: number;
}

interface Person {
  id: number; first_name: string; last_name: string; role: string; profile_photo_url: string | null;
}

const CATEGORIES = ['All', 'General', 'Pest Control', 'Soil Health', 'Weather', 'Market Prices', 'Irrigation', 'Seeds & Planting', 'Q&A'];

function roleColor(role: string) {
  if (role === 'AgriculturalOfficer') return '#065f46';
  if (role === 'Farmer')              return '#92400e';
  if (role === 'Admin')               return '#991b1b';
  return '#374151';
}

function roleBgColor(role: string) {
  if (role === 'AgriculturalOfficer') return '#d1fae5';
  if (role === 'Farmer')              return '#fef3c7';
  if (role === 'Admin')               return '#fee2e2';
  return '#f3f4f6';
}

function initials(first: string, last: string) {
  return `${first?.[0] ?? ''}${last?.[0] ?? ''}`.toUpperCase();
}

function timeAgo(dateStr: string): string {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60)    return 'Just now';
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function CommunityPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [posts, setPosts] = useState<Post[]>([]);
  const [officers, setOfficers] = useState<Person[]>([]);
  const [farmers, setFarmers] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'General' });
  const [posting, setPosting] = useState(false);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = { limit: 50 };
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (search.trim()) params.search = search.trim();
      // support ?authorId= from OfficersPage "View Posts" link
      const authorIdParam = searchParams.get('authorId');
      if (authorIdParam) params.authorId = parseInt(authorIdParam);
      const res = await communityAPI.getPosts(params);
      setPosts(res.data.data || []);
    } catch {
      toast.error('Failed to load community posts');
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, search, searchParams]);

  useEffect(() => {
    const t = setTimeout(() => loadPosts(), 300);
    return () => clearTimeout(t);
  }, [loadPosts]);

  useEffect(() => {
    communityAPI.getOfficers().then(r => setOfficers(r.data.data || [])).catch(() => {});
    if (user) communityAPI.getFarmers().then(r => setFarmers(r.data.data || [])).catch(() => {});
  }, [user]);

  const canPost = user && ['Farmer', 'AgriculturalOfficer', 'Admin'].includes(user.role);

  const handleNewPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    setPosting(true);
    try {
      await communityAPI.createPost(newPost);
      toast.success('Post created!');
      setShowNewPost(false);
      setNewPost({ title: '', content: '', category: 'General' });
      loadPosts();
    } catch {
      toast.error('Failed to create post');
    } finally {
      setPosting(false);
    }
  };

  const handleLike = async (post: Post, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) { toast.info('Login to like posts'); return; }
    try {
      await communityAPI.toggleLike(post.id);
      setPosts(prev => prev.map(p => p.id === post.id
        ? {
            ...p,
            user_liked: p.user_liked ? 0 : 1,
            likes_count: Math.max(0, p.user_liked ? p.likes_count - 1 : p.likes_count + 1),
          }
        : p
      ));
    } catch {
      toast.error('Failed to update like');
    }
  };

  const handleMessagePerson = async (person: Person) => {
    if (!user) { navigate('/login'); return; }
    navigate(`/messages?partner=${person.id}`);
  };

  return (
    <div className="community-page">
      {/* ── Main content ────────────────────────── */}
      <div className="community-main">
        <div className="community-header">
          <h1>🌾 Farmer Community</h1>
          <p>Connect with fellow farmers and agricultural officers across Ghana</p>
        </div>

        {/* Toolbar */}
        <div className="community-toolbar">
          <div className="community-search">
            <i className="fas fa-search" />
            <input
              placeholder="Search discussions…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          {canPost && (
            <button
              className="btn-primary"
              onClick={() => setShowNewPost(true)}
              style={{ background: '#0d5415', color: '#fff', border: 'none', borderRadius: '10px', padding: '0.55rem 1.1rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }}
            >
              <i className="fas fa-pen" /> New Post
            </button>
          )}
        </div>

        {/* Category filters */}
        <div className="category-filters">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`cat-chip${selectedCategory === cat ? ' active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Posts */}
        {loading ? (
          <div className="posts-loading">
            <div className="spinner" />
            <p>Loading posts…</p>
          </div>
        ) : posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>
            <i className="fas fa-comments" style={{ fontSize: '2.5rem', color: '#d1fae5', display: 'block', marginBottom: '0.75rem' }} />
            <h3 style={{ color: '#374151' }}>No posts yet in this category</h3>
            <p>Be the first to start a discussion!</p>
          </div>
        ) : (
          <div className="post-list">
            {posts.map(post => (
              <article
                key={post.id}
                className={`post-card${post.is_pinned ? ' pinned' : ''}`}
                onClick={() => navigate(`/community/post/${post.id}`)}
              >
                <div className="post-header">
                  <div
                    className="post-avatar"
                    style={{ background: roleColor(post.author_role), backgroundColor: roleBgColor(post.author_role), color: roleColor(post.author_role) }}
                  >
                    {initials(post.author_first_name, post.author_last_name)}
                  </div>
                  <div className="post-author-info">
                    <div className="post-author-name">{post.author_first_name} {post.author_last_name}</div>
                    <div className="post-author-meta">
                      <span
                        className={`role-badge ${post.author_role === 'AgriculturalOfficer' ? 'officer' : post.author_role === 'Admin' ? 'admin' : 'farmer'}`}
                      >
                        {post.author_role === 'AgriculturalOfficer' ? '🏛️ Officer' : post.author_role === 'Admin' ? '🛡️ Admin' : '🌱 Farmer'}
                      </span>
                      <span className="post-time">{timeAgo(post.created_at)}</span>
                    </div>
                  </div>
                  <span className="cat-tag">{post.category}</span>
                  {!!post.is_pinned && <i className="fas fa-thumbtack pin-icon" title="Pinned" />}
                </div>

                <h2 className="post-title">{post.title}</h2>
                <p className="post-preview">{post.content}</p>

                <div className="post-footer">
                  <span className={`post-stat${post.user_liked ? ' liked' : ''}`} onClick={e => handleLike(post, e)}>
                    <i className={`${post.user_liked ? 'fas' : 'far'} fa-heart`} /> {post.likes_count}
                  </span>
                  <span className="post-stat">
                    <i className="far fa-comment" /> {post.replies_count}
                  </span>
                  <span className="post-stat" style={{ marginLeft: 'auto', color: '#0d5415', fontWeight: 600, fontSize: '0.8rem' }}>
                    Read more →
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* ── Sidebar ──────────────────────────────── */}
      <aside className="community-sidebar">
        {/* Officers */}
        <div className="sidebar-card">
          <h3>🏛️ Agricultural Officers</h3>
          {officers.length === 0 ? (
            <p style={{ fontSize: '0.82rem', color: '#9ca3af' }}>No officers registered yet</p>
          ) : (
            officers.slice(0, 5).map(o => (
              <div key={o.id} className="officer-item" onClick={() => handleMessagePerson(o)}>
                <div className="sidebar-avatar" style={{ background: '#d1fae5', color: '#065f46' }}>
                  {initials(o.first_name, o.last_name)}
                </div>
                <div>
                  <div className="sidebar-name">{o.first_name} {o.last_name}</div>
                  <div className="sidebar-role">🏛️ Agricultural Officer</div>
                </div>
              </div>
            ))
          )}
          <button
            onClick={() => navigate('/officers')}
            style={{ marginTop: '0.5rem', width: '100%', padding: '0.45rem', background: '#f0fdf4', border: '1.5px solid #d1fae5', borderRadius: '8px', color: '#0d5415', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer' }}
          >
            View all officers →
          </button>
        </div>

        {/* Farmers — only for logged-in users */}
        {user && (
          <div className="sidebar-card">
            <h3>🌱 Farmers</h3>
            {farmers.slice(0, 5).map(f => (
              <div key={f.id} className="farmer-item" onClick={() => handleMessagePerson(f)}>
                <div className="sidebar-avatar" style={{ background: '#fef3c7', color: '#92400e' }}>
                  {initials(f.first_name, f.last_name)}
                </div>
                <div>
                  <div className="sidebar-name">{f.first_name} {f.last_name}</div>
                  <div className="sidebar-role">🌱 Farmer</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </aside>

      {/* New post modal */}
      {showNewPost && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
          onClick={e => e.target === e.currentTarget && setShowNewPost(false)}
        >
          <div style={{ background: '#fff', borderRadius: '20px', padding: '1.75rem', width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1a3c1f', margin: '0 0 1.25rem' }}>✍️ New Community Post</h2>
            <form className="new-post-form" onSubmit={handleNewPost}>
              <div className="form-group">
                <label>Title *</label>
                <input
                  required
                  maxLength={200}
                  placeholder="What's your post about?"
                  value={newPost.title}
                  onChange={e => setNewPost(p => ({ ...p, title: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label>Category *</label>
                <select value={newPost.category} onChange={e => setNewPost(p => ({ ...p, category: e.target.value }))}>
                  {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Content *</label>
                <textarea
                  required
                  rows={6}
                  placeholder="Share your experience, question, or advice with the community…"
                  value={newPost.content}
                  onChange={e => setNewPost(p => ({ ...p, content: e.target.value }))}
                />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowNewPost(false)}
                  style={{ padding: '0.6rem 1.25rem', background: '#f3f4f6', border: 'none', borderRadius: '9px', fontWeight: 600, cursor: 'pointer', color: '#374151' }}>
                  Cancel
                </button>
                <button type="submit" disabled={posting}
                  style={{ padding: '0.6rem 1.4rem', background: '#0d5415', color: '#fff', border: 'none', borderRadius: '9px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  {posting ? <><i className="fas fa-spinner fa-spin" /> Posting…</> : <><i className="fas fa-paper-plane" /> Post</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
