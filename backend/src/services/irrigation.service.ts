import { query } from '../config/database';
import { IrrigationSchedule, IrrigationLog } from '../types';

function addDays(date: Date, days: number): string {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d.toISOString().replace('T', ' ').substring(0, 19);
}

export class IrrigationService {
  // ─── Schedules ────────────────────────────────────────────────────────────

  static async getSchedules(farmerId: number): Promise<IrrigationSchedule[]> {
    const result = await query(
      `SELECT * FROM irrigation_schedules WHERE farmer_id = ? ORDER BY is_active DESC, created_at DESC`,
      [farmerId]
    );
    return result.rows as IrrigationSchedule[];
  }

  static async getScheduleById(id: number): Promise<IrrigationSchedule | null> {
    const result = await query(`SELECT * FROM irrigation_schedules WHERE id = ?`, [id]);
    return result.rows.length > 0 ? (result.rows[0] as IrrigationSchedule) : null;
  }

  static async createSchedule(farmerId: number, data: {
    field_name: string;
    crop_type: string;
    area_hectares?: number;
    irrigation_method?: string;
    frequency_days: number;
    notes?: string;
  }): Promise<IrrigationSchedule> {
    const nextWatering = addDays(new Date(), data.frequency_days);

    await query(
      `INSERT INTO irrigation_schedules
         (farmer_id, field_name, crop_type, area_hectares, irrigation_method, frequency_days, next_watering_at, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        farmerId,
        data.field_name,
        data.crop_type,
        data.area_hectares ?? null,
        data.irrigation_method ?? null,
        data.frequency_days,
        nextWatering,
        data.notes ?? null,
      ]
    );

    const result = await query(
      `SELECT * FROM irrigation_schedules WHERE farmer_id = ? ORDER BY id DESC LIMIT 1`,
      [farmerId]
    );
    return result.rows[0] as IrrigationSchedule;
  }

  static async updateSchedule(
    scheduleId: number,
    farmerId: number,
    data: Partial<IrrigationSchedule>
  ): Promise<IrrigationSchedule | null> {
    const schedule = await this.getScheduleById(scheduleId);
    if (!schedule) throw new Error('Schedule not found');
    if (schedule.farmer_id !== farmerId) throw new Error('Forbidden');

    const fields: string[] = [];
    const params: any[] = [];

    const allowed: (keyof IrrigationSchedule)[] = [
      'field_name', 'crop_type', 'area_hectares', 'irrigation_method',
      'frequency_days', 'notes', 'is_active',
    ];

    for (const key of allowed) {
      if (data[key] !== undefined) {
        fields.push(`${key} = ?`);
        params.push(data[key]);
      }
    }

    if (fields.length === 0) return schedule;

    params.push(scheduleId);
    await query(`UPDATE irrigation_schedules SET ${fields.join(', ')} WHERE id = ?`, params);
    return this.getScheduleById(scheduleId);
  }

  static async deleteSchedule(scheduleId: number, farmerId: number): Promise<void> {
    const schedule = await this.getScheduleById(scheduleId);
    if (!schedule) throw new Error('Schedule not found');
    if (schedule.farmer_id !== farmerId) throw new Error('Forbidden');
    await query(`DELETE FROM irrigation_schedules WHERE id = ?`, [scheduleId]);
  }

  // ─── Watering log ─────────────────────────────────────────────────────────

  static async logWatering(farmerId: number, scheduleId: number | null, data: {
    field_name: string;
    watered_at?: string;
    duration_minutes?: number;
    amount_liters?: number;
    method?: string;
    rainfall_mm?: number;
    notes?: string;
  }): Promise<IrrigationLog> {
    const wateredAt = data.watered_at || new Date().toISOString().replace('T', ' ').substring(0, 19);

    await query(
      `INSERT INTO irrigation_logs
         (farmer_id, schedule_id, field_name, watered_at, duration_minutes, amount_liters, method, rainfall_mm, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        farmerId,
        scheduleId ?? null,
        data.field_name,
        wateredAt,
        data.duration_minutes ?? null,
        data.amount_liters ?? null,
        data.method ?? null,
        data.rainfall_mm ?? 0,
        data.notes ?? null,
      ]
    );

    // Update schedule's last_watered_at and next_watering_at
    if (scheduleId) {
      const schedule = await this.getScheduleById(scheduleId);
      if (schedule) {
        const nextWatering = addDays(new Date(wateredAt), schedule.frequency_days);
        await query(
          `UPDATE irrigation_schedules SET last_watered_at = ?, next_watering_at = ? WHERE id = ?`,
          [wateredAt, nextWatering, scheduleId]
        );
      }
    }

    const result = await query(
      `SELECT * FROM irrigation_logs WHERE farmer_id = ? ORDER BY id DESC LIMIT 1`,
      [farmerId]
    );
    return result.rows[0] as IrrigationLog;
  }

  static async getLogs(farmerId: number, limit = 20, offset = 0): Promise<IrrigationLog[]> {
    const result = await query(
      `SELECT il.*, is2.crop_type
       FROM irrigation_logs il
       LEFT JOIN irrigation_schedules is2 ON il.schedule_id = is2.id
       WHERE il.farmer_id = ?
       ORDER BY il.watered_at DESC
       LIMIT ? OFFSET ?`,
      [farmerId, limit, offset]
    );
    return result.rows as IrrigationLog[];
  }

  static async getDueSchedules(farmerId: number): Promise<IrrigationSchedule[]> {
    const result = await query(
      `SELECT * FROM irrigation_schedules
       WHERE farmer_id = ?
         AND is_active = 1
         AND (next_watering_at IS NULL OR next_watering_at <= datetime('now', '+1 day'))
       ORDER BY next_watering_at ASC`,
      [farmerId]
    );
    return result.rows as IrrigationSchedule[];
  }
}
