import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { messagesAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import { MOCK_CONVERSATIONS } from '../data/mockData';
import './MessagesPage.css';

interface Conversation {
  partner_id: number;
  partner_first_name: string;
  partner_last_name: string;
  partner_role: string;
  last_message: string;
  last_message_at: string;
  unread_count: number;
}

interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  content: string;
  is_read: number;
  created_at: string;
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
  return '#e0f2fe';
}

function roleLabel(role: string) {
  if (role === 'AgriculturalOfficer') return 'Officer';
  return role;
}

function initials(f: string, l: string) {
  return `${f?.[0] ?? ''}${l?.[0] ?? ''}`.toUpperCase();
}

function timeLabel(dateStr: string): string {
  if (!dateStr) return '';
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60)    return 'just now';
  if (diff < 3600)  return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return new Date(dateStr).toLocaleDateString('en-GH', { month: 'short', day: 'numeric' });
}

export default function MessagesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages]           = useState<Message[]>([]);
  const [activePartnerId, setActivePartnerId] = useState<number | null>(null);
  const [activePartner, setActivePartner]     = useState<Conversation | null>(null);
  const [messageText, setMessageText]     = useState('');
  const [sending, setSending]             = useState(false);
  const [loadingConvos, setLoadingConvos] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [showConvoList, setShowConvoList] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval>>();

  // ── Data loaders ─────────────────────────────────────────────────
  const loadConversations = useCallback(async () => {
    try {
      const res = await messagesAPI.getConversations();
      const data = res.data?.data;
      if (data && data.length > 0) {
        setConversations(data);
      } else {
        setConversations(MOCK_CONVERSATIONS as any);
      }
    } catch {
      setConversations(MOCK_CONVERSATIONS as any);
    }
    finally { setLoadingConvos(false); }
  }, []);

  const loadMessages = useCallback(async (partnerId: number) => {
    setLoadingMessages(true);
    try {
      const res = await messagesAPI.getMessages(partnerId);
      const data = res.data?.data;
      if (data && data.length > 0) {
        setMessages(data);
      } else {
        // Mock active conversation thread
        setMessages([
          {
            id: 1,
            sender_id: partnerId,
            receiver_id: user?.id || 999,
            content: 'Hello! I received your inquiry about farm management and soil conditions.',
            is_read: 1,
            created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
          },
          {
            id: 2,
            sender_id: user?.id || 999,
            receiver_id: partnerId,
            content: 'Thank you Officer! I wanted to check the best fertilizer application timing for tomatoes.',
            is_read: 1,
            created_at: new Date(Date.now() - 3600000 * 1.5).toISOString(),
          },
          {
            id: 3,
            sender_id: partnerId,
            receiver_id: user?.id || 999,
            content: 'Apply NPK 15-15-15 at 2 weeks after transplanting (5g per plant, 5cm away from base). Top-dress with Potassium Nitrate at flowering stage for firm fruit set.',
            is_read: 1,
            created_at: new Date(Date.now() - 3600000 * 1).toISOString(),
          },
        ]);
      }
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch {
      setMessages([
        {
          id: 1,
          sender_id: partnerId,
          receiver_id: user?.id || 999,
          content: 'Hello! I received your inquiry about farm management and soil conditions.',
          is_read: 1,
          created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
        },
        {
          id: 2,
          sender_id: user?.id || 999,
          receiver_id: partnerId,
          content: 'Thank you Officer! I wanted to check the best fertilizer application timing for tomatoes.',
          is_read: 1,
          created_at: new Date(Date.now() - 3600000 * 1.5).toISOString(),
        },
      ]);
    } finally {
      setLoadingMessages(false);
    }
  }, [user]);

  // ── Initial load ──────────────────────────────────────────────────
  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // ── Poll every 10 s — mounted guard prevents setState after unmount ─
  useEffect(() => {
    let mounted = true;
    pollRef.current = setInterval(async () => {
      if (!mounted) return;
      try {
        const res = await messagesAPI.getConversations();
        if (mounted) setConversations(res.data.data || []);
      } catch { /* silent */ }
      if (activePartnerId && mounted) {
        try {
          const res = await messagesAPI.getMessages(activePartnerId);
          if (mounted) setMessages(res.data.data || []);
        } catch { /* silent */ }
      }
    }, 10000);
    return () => { mounted = false; clearInterval(pollRef.current); };
  }, [activePartnerId]);

  // ── Handle ?partner= from "Message" buttons elsewhere ────────────
  useEffect(() => {
    const partnerId = searchParams.get('partner');
    if (partnerId) {
      const id = parseInt(partnerId);
      setActivePartnerId(id);
      setShowConvoList(false);
      loadMessages(id);
    }
  }, [searchParams, loadMessages]);

  // ── Handlers ──────────────────────────────────────────────────────
  const openChat = (conv: Conversation) => {
    setActivePartnerId(conv.partner_id);
    setActivePartner(conv);
    setShowConvoList(false);
    loadMessages(conv.partner_id);
    setConversations(prev =>
      prev.map(c => c.partner_id === conv.partner_id ? { ...c, unread_count: 0 } : c)
    );
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !activePartnerId) return;
    setSending(true);
    const text = messageText.trim();
    setMessageText('');
    try {
      const res = await messagesAPI.sendMessage(activePartnerId, text);
      setMessages(prev => [...prev, res.data.data]);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
      loadConversations();
    } catch {
      toast.error('Failed to send message');
      setMessageText(text);
    } finally {
      setSending(false);
    }
  };

  const activeConv = activePartner || conversations.find(c => c.partner_id === activePartnerId);

  // ── Render ────────────────────────────────────────────────────────
  return (
    <div className="messages-page">

      {/* ── Conversation list ─────────────────── */}
      <div className={`convos-panel${!showConvoList ? ' hidden-mobile' : ''}`}>
        <div className="convos-header">
          <h2><i className="fas fa-comments" /> Messages</h2>
        </div>

        {loadingConvos ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>
            <i className="fas fa-spinner fa-spin" style={{ fontSize: '1.5rem' }} />
          </div>
        ) : conversations.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: '#9ca3af' }}>
            <i className="fas fa-inbox" style={{ fontSize: '2rem', display: 'block', marginBottom: '0.75rem', color: '#d1fae5' }} />
            <p style={{ margin: 0 }}>No conversations yet</p>
            <p style={{ fontSize: '0.82rem', marginTop: '0.25rem' }}>Go to Community to message farmers or officers</p>
            <button
              onClick={() => navigate('/community')}
              style={{ marginTop: '1rem', padding: '0.5rem 1.2rem', background: '#0d5415', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }}
            >
              Go to Community
            </button>
          </div>
        ) : (
          <div className="convos-list">
            {conversations.map(conv => (
              <button
                key={conv.partner_id}
                className={`convo-item${activePartnerId === conv.partner_id ? ' active' : ''}`}
                onClick={() => openChat(conv)}
              >
                <div className="convo-avatar" style={{ background: roleBg(conv.partner_role), color: roleColor(conv.partner_role) }}>
                  {initials(conv.partner_first_name, conv.partner_last_name)}
                </div>
                <div className="convo-info">
                  <div className="convo-name-row">
                    <span className="convo-name">{conv.partner_first_name} {conv.partner_last_name}</span>
                    <span className="convo-time">{timeLabel(conv.last_message_at)}</span>
                  </div>
                  <div className="convo-preview-row">
                    <span className="convo-preview">{conv.last_message || '—'}</span>
                    {conv.unread_count > 0 && (
                      <span className="convo-badge">{conv.unread_count}</span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Chat window ───────────────────────── */}
      <div className={`chat-panel${showConvoList && !activePartnerId ? ' hidden-mobile' : ''}`}>
        {!activePartnerId ? (
          <div className="chat-empty">
            <i className="fas fa-comment-dots" />
            <h3>Select a conversation</h3>
            <p>Choose a person from the list to start chatting</p>
          </div>
        ) : (
          <>
            <div className="chat-header">
              <button className="back-btn" onClick={() => { setShowConvoList(true); setActivePartnerId(null); }}>
                <i className="fas fa-arrow-left" />
              </button>
              {activeConv && (
                <>
                  <div className="chat-avatar" style={{ background: roleBg(activeConv.partner_role), color: roleColor(activeConv.partner_role) }}>
                    {initials(activeConv.partner_first_name, activeConv.partner_last_name)}
                  </div>
                  <div className="chat-partner-info">
                    <div className="chat-partner-name">{activeConv.partner_first_name} {activeConv.partner_last_name}</div>
                    <div className="chat-partner-role" style={{ color: roleColor(activeConv.partner_role) }}>
                      {roleLabel(activeConv.partner_role)}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="messages-list">
              {loadingMessages ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>
                  <i className="fas fa-spinner fa-spin" />
                </div>
              ) : messages.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>
                  <i className="fas fa-comment-slash" style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }} />
                  <p>No messages yet. Say hello! 👋</p>
                </div>
              ) : (
                messages.map(msg => {
                  const isMine = msg.sender_id === user?.id;
                  return (
                    <div key={msg.id} className={`msg-bubble-wrap${isMine ? ' mine' : ' theirs'}`}>
                      <div className={`msg-bubble${isMine ? ' mine' : ' theirs'}`}>
                        {msg.content}
                      </div>
                      <span className="msg-time">{timeLabel(msg.created_at)}</span>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            <form className="chat-input-row" onSubmit={handleSend}>
              <input
                type="text"
                placeholder="Type a message…"
                value={messageText}
                onChange={e => setMessageText(e.target.value)}
                disabled={sending}
                autoComplete="off"
              />
              <button type="submit" disabled={sending || !messageText.trim()} className="send-btn">
                {sending
                  ? <i className="fas fa-spinner fa-spin" />
                  : <i className="fas fa-paper-plane" />
                }
              </button>
            </form>
          </>
        )}
      </div>

    </div>
  );
}
