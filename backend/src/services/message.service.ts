import { query } from '../config/database';
import { Message, Conversation } from '../types';

export class MessageService {
  static async getConversations(userId: number): Promise<Conversation[]> {
    // Find all distinct partners this user has exchanged messages with
    const result = await query(
      `SELECT
        partner_id,
        u.first_name  AS partner_first_name,
        u.last_name   AS partner_last_name,
        u.role        AS partner_role,
        u.profile_photo_url AS partner_profile_photo_url,
        last_message,
        last_message_at,
        unread_count
       FROM (
         SELECT
           CASE WHEN sender_id = ? THEN receiver_id ELSE sender_id END AS partner_id,
           (SELECT content FROM messages m2
            WHERE (m2.sender_id = ? AND m2.receiver_id = CASE WHEN m.sender_id = ? THEN m.receiver_id ELSE m.sender_id END)
               OR (m2.receiver_id = ? AND m2.sender_id = CASE WHEN m.sender_id = ? THEN m.receiver_id ELSE m.sender_id END)
            ORDER BY m2.created_at DESC LIMIT 1) AS last_message,
           MAX(created_at) AS last_message_at,
           SUM(CASE WHEN receiver_id = ? AND is_read = 0 AND sender_id = CASE WHEN m.sender_id = ? THEN m.receiver_id ELSE m.sender_id END THEN 1 ELSE 0 END) AS unread_count
         FROM messages m
         WHERE sender_id = ? OR receiver_id = ?
         GROUP BY partner_id
       ) conv
       JOIN users u ON u.id = conv.partner_id
       ORDER BY last_message_at DESC`,
      [userId, userId, userId, userId, userId, userId, userId, userId, userId]
    );
    return result.rows as Conversation[];
  }

  static async getMessages(
    userId: number,
    partnerId: number,
    limit = 50,
    offset = 0
  ): Promise<Message[]> {
    const result = await query(
      `SELECT * FROM messages
       WHERE (sender_id = ? AND receiver_id = ?)
          OR (sender_id = ? AND receiver_id = ?)
       ORDER BY created_at ASC
       LIMIT ? OFFSET ?`,
      [userId, partnerId, partnerId, userId, limit, offset]
    );
    return result.rows as Message[];
  }

  static async sendMessage(senderId: number, receiverId: number, content: string): Promise<Message> {
    if (senderId === receiverId) throw new Error('Cannot send message to yourself');

    // Ensure receiver exists
    const userCheck = await query('SELECT id FROM users WHERE id = ? AND status = ?', [receiverId, 'Active']);
    if (userCheck.rows.length === 0) throw new Error('Recipient not found');

    await query(
      `INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)`,
      [senderId, receiverId, content]
    );

    const result = await query(
      `SELECT * FROM messages WHERE sender_id = ? AND receiver_id = ? ORDER BY id DESC LIMIT 1`,
      [senderId, receiverId]
    );
    return result.rows[0] as Message;
  }

  static async markRead(userId: number, partnerId: number): Promise<void> {
    await query(
      `UPDATE messages SET is_read = 1
       WHERE receiver_id = ? AND sender_id = ? AND is_read = 0`,
      [userId, partnerId]
    );
  }

  static async getUnreadCount(userId: number): Promise<number> {
    const result = await query(
      `SELECT COUNT(*) AS cnt FROM messages WHERE receiver_id = ? AND is_read = 0`,
      [userId]
    );
    return (result.rows[0] as any).cnt as number;
  }
}
