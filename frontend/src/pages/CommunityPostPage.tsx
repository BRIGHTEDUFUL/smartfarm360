import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { communityAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import './CommunityPage.css';

interface Post {
  id: number; author_id: number; title: string; content: string; category: string;
  likes_count: number; replies_count: number; is_pinned: number; created_at: string;
  author_first_name: string; author_last_name: string; author_role: string;
  user_liked?: number;
}

interface Reply {
  id: number; post_id: number; author_id: number; content: string;
  likes_count: number; created_at: string;
  author_first_name: string; author_last_name: string; author_role: string;
  user_liked?: number;
}

function timeAgo(dateStr: string): string {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60)    return 'Just now';
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(dateStr).toLocaleDateString('en-GH', { day: 'numeric', month: 'short', year: 'numeric' });
}

function roleColor(role: string) {
  if (role === 'AgriculturalOfficer') return '#065f46';
  if (role === 'Farmer')              return '#92400e';
  if (role === 'Admin')               return '#991b1b';
  return '#374151';
}

function roleBg(role: string) {
  if (role === 'AgriculturalOfficer') return '#d1fae5';
  if (role === 'Farmer')              return '#fef3c7';
  if (role === 'Admin')               return '#fee2e2';
  return '#f3f4f6';
}

function initials(f: string, l: string) {
  return `${f?.[0] ?? ''}${l?.[0] ?? ''}`.toUpperCase();
}

function roleLabel(role: string) {
  if (role === 'AgriculturalOfficer') return '🏛️ Officer';
  if (role === 'Admin')               return '🛡️ Admin';
  return '🌱 Farmer';
}

import { MOCK_COMMUNITY_POSTS, MOCK_REPLIES } from '../data/mockData';

export default function CommunityPostPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    const postId = parseInt(id);
    Promise.all([
      communityAPI.getPost(postId),
      communityAPI.getReplies(postId),
    ]).then(([pRes, rRes]) => {
      const p = pRes.data?.data;
      if (p) {
        setPost(p);
        setReplies(rRes.data?.data || []);
      } else {
        const mockP = MOCK_COMMUNITY_POSTS.find(x => x.id === postId) || MOCK_COMMUNITY_POSTS[0];
        setPost(mockP);
        setReplies(MOCK_REPLIES[mockP.id] || []);
      }
    }).catch(() => {
      const mockP = MOCK_COMMUNITY_POSTS.find(x => x.id === postId) || MOCK_COMMUNITY_POSTS[0];
      setPost(mockP);
      setReplies(MOCK_REPLIES[mockP.id] || []);
    }).finally(() => setLoading(false));
  }, [id]);

  const handleLikePost = async () => {
    if (!user || !post) { toast.info('Login to like'); return; }
    try {
      await communityAPI.toggleLike(post.id);
      setPost(p => p ? { ...p, user_liked: p.user_liked ? 0 : 1, likes_count: p.user_liked ? p.likes_count - 1 : p.likes_count + 1 } : p);
    } catch { toast.error('Failed to like'); }
  };

  const handleLikeReply = async (reply: Reply) => {
    if (!user) { toast.info('Login to like'); return; }
    try {
      await communityAPI.toggleLike(post!.id, 'reply', reply.id);
      setReplies(prev => prev.map(r => r.id === reply.id
        ? { ...r, user_liked: r.user_liked ? 0 : 1, likes_count: r.user_liked ? r.likes_count - 1 : r.likes_count + 1 }
        : r
      ));
    } catch { toast.error('Failed to like'); }
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    if (!replyText.trim()) return;
    setSubmitting(true);
    try {
      const res = await communityAPI.createReply(parseInt(id!), replyText.trim());
      setReplies(prev => [...prev, res.data.data]);
      setPost(p => p ? { ...p, replies_count: p.replies_count + 1 } : p);
      setReplyText('');
      toast.success('Reply posted!');
    } catch { toast.error('Failed to post reply'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async () => {
    if (!post || !confirm('Delete this post?')) return;
    try {
      await communityAPI.deletePost(post.id);
      toast.success('Post deleted');
      navigate('/community');
    } catch { toast.error('Failed to delete'); }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '4rem', color: '#9ca3af' }}><i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem' }} /></div>;
  }

  if (!post) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <h2>Post not found</h2>
        <button onClick={() => navigate('/community')} style={{ marginTop: '1rem', padding: '0.6rem 1.5rem', background: '#0d5415', color: '#fff', border: 'none', borderRadius: '9px', cursor: 'pointer', fontWeight: 600 }}>
          Back to Community
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '2rem 1rem 6rem' }}>
      {/* Back */}
      <button onClick={() => navigate('/community')}
        style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'none', border: 'none', color: '#0d5415', fontWeight: 600, cursor: 'pointer', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
        <i className="fas fa-arrow-left" /> Back to Community
      </button>

      {/* Post */}
      <div style={{ background: '#fff', border: '1.5px solid #d1fae5', borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Author */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: roleBg(post.author_role), color: roleColor(post.author_role), display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.95rem', flexShrink: 0 }}>
            {initials(post.author_first_name, post.author_last_name)}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, color: '#1a3c1f' }}>{post.author_first_name} {post.author_last_name}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '10px', background: roleBg(post.author_role), color: roleColor(post.author_role) }}>
                {roleLabel(post.author_role)}
              </span>
              <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{timeAgo(post.created_at)}</span>
              <span style={{ fontSize: '0.72rem', background: '#eff6ff', color: '#1d4ed8', padding: '0.15rem 0.55rem', borderRadius: '8px', fontWeight: 600 }}>{post.category}</span>
            </div>
          </div>
          {/* Actions */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {user && user.id === post.author_id && (
              <button onClick={handleDelete} title="Delete post"
                style={{ background: '#fee2e2', border: 'none', borderRadius: '8px', padding: '0.4rem 0.6rem', color: '#dc2626', cursor: 'pointer', fontSize: '0.85rem' }}>
                <i className="fas fa-trash" />
              </button>
            )}
            {user && user.id !== post.author_id && (
              <button onClick={() => navigate(`/messages?partner=${post.author_id}`)}
                style={{ background: '#f0fdf4', border: '1.5px solid #d1fae5', borderRadius: '8px', padding: '0.4rem 0.8rem', color: '#0d5415', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <i className="fas fa-envelope" /> Message
              </button>
            )}
          </div>
        </div>

        <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#111827', margin: '0 0 1rem', lineHeight: 1.4 }}>{post.title}</h1>
        <p style={{ fontSize: '1rem', color: '#374151', lineHeight: 1.7, whiteSpace: 'pre-wrap', margin: '0 0 1.25rem' }}>{post.content}</p>

        {/* Like */}
        <button onClick={handleLikePost}
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: post.user_liked ? '#fee2e2' : '#f9fafb', border: '1.5px solid', borderColor: post.user_liked ? '#fca5a5' : '#e5e7eb', borderRadius: '9px', padding: '0.45rem 1rem', cursor: 'pointer', color: post.user_liked ? '#ef4444' : '#6b7280', fontWeight: 600, fontSize: '0.88rem', transition: 'all 0.15s' }}>
          <i className={`${post.user_liked ? 'fas' : 'far'} fa-heart`} /> {post.likes_count} {post.likes_count === 1 ? 'Like' : 'Likes'}
        </button>
      </div>

      {/* Replies */}
      <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1a3c1f', margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <i className="fas fa-comments" /> {replies.length} {replies.length === 1 ? 'Reply' : 'Replies'}
      </h2>

      {replies.map(reply => (
        <div key={reply.id} style={{ background: '#fff', border: '1.5px solid #e5e7eb', borderRadius: '13px', padding: '1rem 1.1rem', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: roleBg(reply.author_role), color: roleColor(reply.author_role), display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.78rem', flexShrink: 0 }}>
              {initials(reply.author_first_name, reply.author_last_name)}
            </div>
            <div>
              <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#1a3c1f' }}>{reply.author_first_name} {reply.author_last_name}</span>
              <span style={{ fontSize: '0.7rem', marginLeft: '0.4rem', fontWeight: 700, padding: '0.1rem 0.45rem', borderRadius: '8px', background: roleBg(reply.author_role), color: roleColor(reply.author_role) }}>
                {roleLabel(reply.author_role)}
              </span>
              <span style={{ fontSize: '0.72rem', color: '#9ca3af', marginLeft: '0.4rem' }}>{timeAgo(reply.created_at)}</span>
            </div>
          </div>
          <p style={{ fontSize: '0.92rem', color: '#374151', margin: '0 0 0.6rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{reply.content}</p>
          <button onClick={() => handleLikeReply(reply)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: reply.user_liked ? '#ef4444' : '#9ca3af', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <i className={`${reply.user_liked ? 'fas' : 'far'} fa-heart`} /> {reply.likes_count}
          </button>
        </div>
      ))}

      {/* Reply form */}
      {user ? (
        <form onSubmit={handleReply} style={{ background: '#fff', border: '1.5px solid #d1fae5', borderRadius: '13px', padding: '1rem', marginTop: '1rem' }}>
          <textarea
            required
            rows={3}
            placeholder="Write a reply…"
            value={replyText}
            onChange={e => setReplyText(e.target.value)}
            style={{ width: '100%', border: '1.5px solid #d1d5db', borderRadius: '9px', padding: '0.65rem', fontSize: '0.92rem', resize: 'vertical', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
          />
          <button type="submit" disabled={submitting}
            style={{ marginTop: '0.65rem', padding: '0.6rem 1.4rem', background: '#0d5415', color: '#fff', border: 'none', borderRadius: '9px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            {submitting ? <><i className="fas fa-spinner fa-spin" /> Posting…</> : <><i className="fas fa-paper-plane" /> Post Reply</>}
          </button>
        </form>
      ) : (
        <div style={{ textAlign: 'center', padding: '1.5rem', background: '#f9fafb', borderRadius: '13px', marginTop: '1rem' }}>
          <p style={{ color: '#6b7280', margin: '0 0 0.75rem' }}>Login to join the discussion</p>
          <button onClick={() => navigate('/login')}
            style={{ padding: '0.55rem 1.5rem', background: '#0d5415', color: '#fff', border: 'none', borderRadius: '9px', fontWeight: 600, cursor: 'pointer' }}>
            Login
          </button>
        </div>
      )}
    </div>
  );
}
