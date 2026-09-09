import { query } from '../config/database';
import { Connection } from '../types';

export class ConnectionService {
  static async getConnections(userId: number): Promise<any[]> {
    const result = await query(
      `SELECT c.*,
        CASE WHEN c.requester_id = ? THEN c.addressee_id ELSE c.requester_id END AS partner_id,
        u.first_name AS partner_first_name,
        u.last_name  AS partner_last_name,
        u.role       AS partner_role,
        u.profile_photo_url AS partner_profile_photo_url
       FROM connections c
       JOIN users u ON u.id = CASE WHEN c.requester_id = ? THEN c.addressee_id ELSE c.requester_id END
       WHERE (c.requester_id = ? OR c.addressee_id = ?) AND c.status = 'Accepted'
       ORDER BY c.created_at DESC`,
      [userId, userId, userId, userId]
    );
    return result.rows;
  }

  static async getPendingRequests(userId: number): Promise<any[]> {
    const result = await query(
      `SELECT c.*,
        u.first_name AS requester_first_name,
        u.last_name  AS requester_last_name,
        u.role       AS requester_role,
        u.profile_photo_url AS requester_profile_photo_url
       FROM connections c
       JOIN users u ON u.id = c.requester_id
       WHERE c.addressee_id = ? AND c.status = 'Pending'
       ORDER BY c.created_at DESC`,
      [userId]
    );
    return result.rows;
  }

  static async sendRequest(requesterId: number, addresseeId: number): Promise<Connection> {
    if (requesterId === addresseeId) throw new Error('Cannot connect with yourself');

    // Check if already exists
    const existing = await query(
      `SELECT * FROM connections WHERE (requester_id = ? AND addressee_id = ?) OR (requester_id = ? AND addressee_id = ?)`,
      [requesterId, addresseeId, addresseeId, requesterId]
    );
    if (existing.rows.length > 0) throw new Error('Connection already exists');

    await query(
      `INSERT INTO connections (requester_id, addressee_id, status) VALUES (?, ?, 'Pending')`,
      [requesterId, addresseeId]
    );

    const result = await query(
      `SELECT * FROM connections WHERE requester_id = ? AND addressee_id = ?`,
      [requesterId, addresseeId]
    );
    return result.rows[0] as Connection;
  }

  static async respond(connectionId: number, userId: number, action: 'Accept' | 'Decline'): Promise<Connection> {
    const conn = await query(`SELECT * FROM connections WHERE id = ?`, [connectionId]);
    if (conn.rows.length === 0) throw new Error('Connection not found');

    const connection = conn.rows[0] as Connection;
    if (connection.addressee_id !== userId) throw new Error('Forbidden');

    const newStatus = action === 'Accept' ? 'Accepted' : 'Declined';
    await query(`UPDATE connections SET status = ? WHERE id = ?`, [newStatus, connectionId]);

    const updated = await query(`SELECT * FROM connections WHERE id = ?`, [connectionId]);
    return updated.rows[0] as Connection;
  }
}
