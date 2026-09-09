import { useState, useEffect, useCallback } from 'react';
import { irrigationAPI } from '../services/api';
import { toast } from 'react-toastify';
import { MOCK_IRRIGATION_SCHEDULES, MOCK_IRRIGATION_LOGS } from '../data/mockData';
import './IrrigationPage.css';

interface Schedule {
  id: number;
  field_name: string;
  crop_type: string;
  area_hectares: number | null;
  irrigation_method: string | null;
  frequency_days: number;
  last_watered_at: string | null;
  next_watering_at: string | null;
  notes: string | null;
  is_active: number;
}

interface IrrigationLog {
  id: number;
  field_name: string;
  watered_at: string;
  duration_minutes: number | null;
  amount_liters: number | null;
  method: string | null;
  rainfall_mm: number;
  notes: string | null;
  crop_type?: string;
}

type ActiveTab = 'schedules' | 'history';

const methodIcons: Record<string, string> = {
  Drip: '💧', Sprinkler: '🌀', Flood: '🌊', Manual: '🪣',
};

function nextWateringStatus(next: string | null): { label: string; cls: string } {
  if (!next) return { label: 'Not set', cls: '' };
  const diff = (new Date(next).getTime() - Date.now()) / 86400000;
  if (diff < 0)   return { label: 'Overdue', cls: 'overdue' };
  if (diff < 1)   return { label: 'Due today', cls: 'due-soon' };
  if (diff < 3)   return { label: `In ${Math.ceil(diff)} day(s)`, cls: 'due-soon' };
  return { label: new Date(next).toLocaleDateString('en-GH', { month: 'short', day: 'numeric' }), cls: '' };
}

export default function IrrigationPage() {
  const [tab, setTab] = useState<ActiveTab>('schedules');
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [dueSchedules, setDueSchedules] = useState<Schedule[]>([]);
  const [logs, setLogs] = useState<IrrigationLog[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);
  const [editSchedule, setEditSchedule] = useState<Schedule | null>(null);
  const [logTargetSchedule, setLogTargetSchedule] = useState<Schedule | null>(null);

  // Form state
  const emptyScheduleForm = { field_name: '', crop_type: '', area_hectares: '', irrigation_method: '', frequency_days: '3', notes: '' };
  const emptyLogForm = { field_name: '', watered_at: '', duration_minutes: '', amount_liters: '', rainfall_mm: '', notes: '' };
  const [scheduleForm, setScheduleForm] = useState(emptyScheduleForm);
  const [logForm, setLogForm] = useState(emptyLogForm);
  const [saving, setSaving] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [sRes, dRes] = await Promise.all([
        irrigationAPI.getSchedules(),
        irrigationAPI.getDue(),
      ]);
      const s = sRes.data?.data;
      const d = dRes.data?.data;
      if (s && s.length > 0) {
        setSchedules(s);
        setDueSchedules(d || []);
      } else {
        setSchedules(MOCK_IRRIGATION_SCHEDULES as any);
        setDueSchedules(MOCK_IRRIGATION_SCHEDULES.slice(0, 2) as any);
      }
    } catch {
      setSchedules(MOCK_IRRIGATION_SCHEDULES as any);
      setDueSchedules(MOCK_IRRIGATION_SCHEDULES.slice(0, 2) as any);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadLogs = useCallback(async () => {
    try {
      const res = await irrigationAPI.getLogs();
      const l = res.data?.data;
      if (l && l.length > 0) {
        setLogs(l);
      } else {
        setLogs(MOCK_IRRIGATION_LOGS as any);
      }
    } catch {
      setLogs(MOCK_IRRIGATION_LOGS as any);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);
  useEffect(() => { if (tab === 'history') loadLogs(); }, [tab, loadLogs]);

  // Open add/edit modal
  const openAdd = () => {
    setEditSchedule(null);
    setScheduleForm(emptyScheduleForm);
    setShowAddModal(true);
  };

  const openEdit = (s: Schedule) => {
    setEditSchedule(s);
    setScheduleForm({
      field_name: s.field_name,
      crop_type: s.crop_type,
      area_hectares: s.area_hectares?.toString() || '',
      irrigation_method: s.irrigation_method || '',
      frequency_days: s.frequency_days.toString(),
      notes: s.notes || '',
    });
    setShowAddModal(true);
  };

  const openLog = (s: Schedule) => {
    setLogTargetSchedule(s);
    setLogForm({ ...emptyLogForm, field_name: s.field_name });
    setShowLogModal(true);
  };

  // Save schedule
  const handleSaveSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        field_name: scheduleForm.field_name,
        crop_type: scheduleForm.crop_type,
        area_hectares: scheduleForm.area_hectares ? parseFloat(scheduleForm.area_hectares) : undefined,
        irrigation_method: scheduleForm.irrigation_method || undefined,
        frequency_days: parseInt(scheduleForm.frequency_days),
        notes: scheduleForm.notes || undefined,
      };
      if (editSchedule) {
        await irrigationAPI.updateSchedule(editSchedule.id, payload);
        toast.success('Schedule updated');
      } else {
        await irrigationAPI.createSchedule(payload);
        toast.success('Schedule created');
      }
      setShowAddModal(false);
      loadData();
    } catch {
      toast.error('Failed to save schedule');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this irrigation schedule?')) return;
    try {
      await irrigationAPI.deleteSchedule(id);
      toast.success('Schedule deleted');
      loadData();
    } catch {
      toast.error('Failed to delete schedule');
    }
  };

  const handleToggleActive = async (s: Schedule) => {
    try {
      await irrigationAPI.updateSchedule(s.id, { is_active: s.is_active ? 0 : 1 });
      toast.success(s.is_active ? 'Schedule paused' : 'Schedule activated');
      loadData();
    } catch {
      toast.error('Failed to update schedule');
    }
  };

  // Save watering log
  const handleSaveLog = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const scheduleId = logTargetSchedule ? logTargetSchedule.id : null;
      await irrigationAPI.logWatering(scheduleId, {
        field_name: logForm.field_name,
        watered_at: logForm.watered_at || undefined,
        duration_minutes: logForm.duration_minutes ? parseInt(logForm.duration_minutes) : undefined,
        amount_liters: logForm.amount_liters ? parseFloat(logForm.amount_liters) : undefined,
        rainfall_mm: logForm.rainfall_mm ? parseFloat(logForm.rainfall_mm) : 0,
        notes: logForm.notes || undefined,
      });
      toast.success('Watering logged successfully');
      setShowLogModal(false);
      loadData();
    } catch {
      toast.error('Failed to log watering');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="irrigation-page">
      {/* Header */}
      <div className="irrigation-header">
        <div>
          <h1>💧 Irrigation Manager</h1>
          <p>Schedule and track watering for all your fields</p>
        </div>
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          <button className="btn-primary" onClick={() => { setLogTargetSchedule(null); setLogForm(emptyLogForm); setShowLogModal(true); }}>
            <i className="fas fa-plus" /> Log Watering
          </button>
          <button className="btn-primary" onClick={openAdd} style={{ background: '#065f46' }}>
            <i className="fas fa-calendar-plus" /> Add Schedule
          </button>
        </div>
      </div>

      {/* Due today / this week */}
      {dueSchedules.length > 0 && (
        <div className="due-panel">
          <h3><i className="fas fa-bell" /> Watering Due</h3>
          <div className="due-list">
            {dueSchedules.map(s => {
              const st = nextWateringStatus(s.next_watering_at);
              return (
                <span key={s.id} className={`due-chip ${st.cls === 'overdue' ? 'overdue' : ''}`}>
                  💧 {s.field_name} — {s.crop_type} · {st.label}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="irrigation-tabs">
        <button className={`irr-tab${tab === 'schedules' ? ' active' : ''}`} onClick={() => setTab('schedules')}>
          <i className="fas fa-calendar-alt" /> Schedules
        </button>
        <button className={`irr-tab${tab === 'history' ? ' active' : ''}`} onClick={() => setTab('history')}>
          <i className="fas fa-history" /> Watering History
        </button>
      </div>

      {/* Schedules tab */}
      {tab === 'schedules' && (
        <>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>
              <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem' }} />
              <p>Loading schedules…</p>
            </div>
          ) : schedules.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-tint-slash" />
              <h3>No irrigation schedules yet</h3>
              <p>Add your first schedule to start tracking watering for your fields.</p>
              <button className="btn-primary" onClick={openAdd} style={{ marginTop: '1rem' }}>
                <i className="fas fa-plus" /> Add Schedule
              </button>
            </div>
          ) : (
            <div className="schedules-grid">
              {schedules.map(s => {
                const st = nextWateringStatus(s.next_watering_at);
                return (
                  <div key={s.id} className={`schedule-card${!s.is_active ? ' inactive' : ''}`}>
                    <div className="schedule-card-header">
                      <div>
                        <div className="schedule-field-name">
                          {methodIcons[s.irrigation_method || ''] || '🌿'} {s.field_name}
                        </div>
                        <div className="schedule-crop-type">{s.crop_type}</div>
                      </div>
                      <span className={`schedule-badge${!s.is_active ? ' inactive' : ''}`}>
                        {s.is_active ? 'Active' : 'Paused'}
                      </span>
                    </div>
                    <div className="schedule-meta">
                      <div className="meta-item">
                        <span className="meta-label">Method</span>
                        <span className="meta-value">{s.irrigation_method || '—'}</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-label">Every</span>
                        <span className="meta-value">{s.frequency_days} day(s)</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-label">Last watered</span>
                        <span className="meta-value">
                          {s.last_watered_at ? new Date(s.last_watered_at).toLocaleDateString('en-GH', { month: 'short', day: 'numeric' }) : 'Never'}
                        </span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-label">Next watering</span>
                        <span className={`meta-value ${st.cls}`}>{st.label}</span>
                      </div>
                      {s.area_hectares && (
                        <div className="meta-item">
                          <span className="meta-label">Area</span>
                          <span className="meta-value">{s.area_hectares} ha</span>
                        </div>
                      )}
                    </div>
                    {s.notes && (
                      <p style={{ fontSize: '0.82rem', color: '#6b7280', margin: '0 0 0.75rem', fontStyle: 'italic' }}>
                        {s.notes}
                      </p>
                    )}
                    <div className="schedule-actions">
                      <button className="btn-log" onClick={() => openLog(s)}>
                        <i className="fas fa-droplet" /> Log Watering
                      </button>
                      <button className="btn-icon" onClick={() => openEdit(s)} title="Edit">
                        <i className="fas fa-edit" />
                      </button>
                      <button className="btn-icon" onClick={() => handleToggleActive(s)} title={s.is_active ? 'Pause' : 'Activate'}>
                        <i className={`fas ${s.is_active ? 'fa-pause' : 'fa-play'}`} />
                      </button>
                      <button className="btn-icon danger" onClick={() => handleDelete(s.id)} title="Delete">
                        <i className="fas fa-trash" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* History tab */}
      {tab === 'history' && (
        <>
          {logs.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-history" />
              <h3>No watering records yet</h3>
              <p>Log your first watering event to start tracking history.</p>
            </div>
          ) : (
            <div className="logs-table-wrap">
              <table className="logs-table">
                <thead>
                  <tr>
                    <th>Field</th>
                    <th>Crop</th>
                    <th>Date</th>
                    <th>Duration</th>
                    <th>Amount</th>
                    <th>Method</th>
                    <th>Rainfall</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map(log => (
                    <tr key={log.id}>
                      <td>{log.field_name}</td>
                      <td>{log.crop_type || '—'}</td>
                      <td>{new Date(log.watered_at).toLocaleDateString('en-GH', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                      <td>{log.duration_minutes ? `${log.duration_minutes} min` : '—'}</td>
                      <td>{log.amount_liters ? `${log.amount_liters} L` : '—'}</td>
                      <td>{log.method || '—'}</td>
                      <td>{log.rainfall_mm ? `${log.rainfall_mm} mm` : '0 mm'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Add / Edit Schedule Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowAddModal(false)}>
          <div className="modal-card">
            <h2>{editSchedule ? '✏️ Edit Schedule' : '📅 New Irrigation Schedule'}</h2>
            <form onSubmit={handleSaveSchedule}>
              <div className="form-row">
                <div className="form-group">
                  <label>Field Name *</label>
                  <input required value={scheduleForm.field_name} onChange={e => setScheduleForm(f => ({ ...f, field_name: e.target.value }))} placeholder="e.g. Main Tomato Field" />
                </div>
                <div className="form-group">
                  <label>Crop Type *</label>
                  <input required value={scheduleForm.crop_type} onChange={e => setScheduleForm(f => ({ ...f, crop_type: e.target.value }))} placeholder="e.g. Tomatoes" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Irrigation Method</label>
                  <select value={scheduleForm.irrigation_method} onChange={e => setScheduleForm(f => ({ ...f, irrigation_method: e.target.value }))}>
                    <option value="">Select method</option>
                    <option>Drip</option>
                    <option>Sprinkler</option>
                    <option>Flood</option>
                    <option>Manual</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Frequency (days) *</label>
                  <input type="number" min="1" max="30" required value={scheduleForm.frequency_days} onChange={e => setScheduleForm(f => ({ ...f, frequency_days: e.target.value }))} />
                </div>
              </div>
              <div className="form-group">
                <label>Area (hectares)</label>
                <input type="number" step="0.01" min="0" value={scheduleForm.area_hectares} onChange={e => setScheduleForm(f => ({ ...f, area_hectares: e.target.value }))} placeholder="e.g. 0.5" />
              </div>
              <div className="form-group">
                <label>Notes</label>
                <textarea rows={2} value={scheduleForm.notes} onChange={e => setScheduleForm(f => ({ ...f, notes: e.target.value }))} placeholder="Reminders or tips for this field…" />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? <><i className="fas fa-spinner fa-spin" /> Saving…</> : <><i className="fas fa-check" /> {editSchedule ? 'Update' : 'Create'}</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Log Watering Modal */}
      {showLogModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowLogModal(false)}>
          <div className="modal-card">
            <h2>💧 Log Watering Event</h2>
            {logTargetSchedule && (
              <p style={{ color: '#6b7280', fontSize: '0.9rem', margin: '-0.5rem 0 1rem' }}>
                Field: <strong>{logTargetSchedule.field_name}</strong> · {logTargetSchedule.crop_type}
              </p>
            )}
            <form onSubmit={handleSaveLog}>
              {!logTargetSchedule && (
                <div className="form-group">
                  <label>Field Name *</label>
                  <input required value={logForm.field_name} onChange={e => setLogForm(f => ({ ...f, field_name: e.target.value }))} placeholder="Field name" />
                </div>
              )}
              <div className="form-row">
                <div className="form-group">
                  <label>Date &amp; Time</label>
                  <input type="datetime-local" value={logForm.watered_at} onChange={e => setLogForm(f => ({ ...f, watered_at: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label>Duration (minutes)</label>
                  <input type="number" min="0" value={logForm.duration_minutes} onChange={e => setLogForm(f => ({ ...f, duration_minutes: e.target.value }))} placeholder="e.g. 30" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Water Used (litres)</label>
                  <input type="number" step="0.1" min="0" value={logForm.amount_liters} onChange={e => setLogForm(f => ({ ...f, amount_liters: e.target.value }))} placeholder="e.g. 200" />
                </div>
                <div className="form-group">
                  <label>Rainfall (mm)</label>
                  <input type="number" step="0.1" min="0" value={logForm.rainfall_mm} onChange={e => setLogForm(f => ({ ...f, rainfall_mm: e.target.value }))} placeholder="0" />
                </div>
              </div>
              <div className="form-group">
                <label>Notes</label>
                <textarea rows={2} value={logForm.notes} onChange={e => setLogForm(f => ({ ...f, notes: e.target.value }))} placeholder="Any observations about the watering…" />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowLogModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? <><i className="fas fa-spinner fa-spin" /> Saving…</> : <><i className="fas fa-check" /> Save Log</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
