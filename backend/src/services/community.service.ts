import { query } from '../config/database';
import { CommunityPost, CommunityReply } from '../types';

const POST_COLS = `
  cp.id, cp.author_id, cp.title, cp.content, cp.category,
  cp.likes_count, cp.replies_count, cp.is_pinned,
  cp.created_at, cp.updated_at,
  u.first_name AS author_first_name,
  u.last_name  AS author_last_name,
  u.role       AS author_role,
  u.profile_photo_url AS author_profile_photo_url
`;

const REPLY_COLS = `
  cr.id, cr.post_id, cr.author_id, cr.content, cr.likes_count,
  cr.created_at, cr.updated_at,
  u.first_name AS author_first_name,
  u.last_name  AS author_last_name,
  u.role       AS author_role,
  u.profile_photo_url AS author_profile_photo_url
`;

export class CommunityService {
  // ─── Posts ────────────────────────────────────────────────────────────────

  static async getPosts(filters: {
    category?: string;
    search?: string;
    authorId?: number;
    limit?: number;
    offset?: number;
    userId?: number; // for user_liked
  }): Promise<CommunityPost[]> {
    let sql = `
      SELECT ${POST_COLS}
      ${filters.userId ? `, (SELECT COUNT(*) FROM community_likes WHERE user_id = ? AND target_type = 'post' AND target_id = cp.id) AS user_liked` : ''}
      FROM community_posts cp
      JOIN users u ON cp.author_id = u.id
      WHERE 1=1
    `;
    const params: any[] = [];
    if (filters.userId) params.push(filters.userId);

    if (filters.category) {
      sql += ' AND cp.category = ?';
      params.push(filters.category);
    }
    if (filters.search) {
      sql += ' AND (cp.title LIKE ? OR cp.content LIKE ?)';
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }
    if (filters.authorId) {
      sql += ' AND cp.author_id = ?';
      params.push(filters.authorId);
    }

    sql += ' ORDER BY cp.is_pinned DESC, cp.created_at DESC';

    if (filters.limit) {
      sql += ' LIMIT ?';
      params.push(filters.limit);
    }
    if (filters.offset !== undefined) {
      sql += ' OFFSET ?';
      params.push(filters.offset);
    }

    const result = await query(sql, params);
    return result.rows as CommunityPost[];
  }

  static async getPostById(postId: number, userId?: number): Promise<CommunityPost | null> {
    const sql = `
      SELECT ${POST_COLS}
      ${userId ? `, (SELECT COUNT(*) FROM community_likes WHERE user_id = ? AND target_type = 'post' AND target_id = cp.id) AS user_liked` : ''}
      FROM community_posts cp
      JOIN users u ON cp.author_id = u.id
      WHERE cp.id = ?
    `;
    const params: any[] = userId ? [userId, postId] : [postId];
    const result = await query(sql, params);
    return result.rows.length > 0 ? (result.rows[0] as CommunityPost) : null;
  }

  static async createPost(authorId: number, data: {
    title: string;
    content: string;
    category: string;
  }): Promise<CommunityPost> {
    await query(
      `INSERT INTO community_posts (author_id, title, content, category)
       VALUES (?, ?, ?, ?)`,
      [authorId, data.title, data.content, data.category]
    );
    const result = await query(
      `SELECT ${POST_COLS}
       FROM community_posts cp
       JOIN users u ON cp.author_id = u.id
       WHERE cp.author_id = ?
       ORDER BY cp.id DESC LIMIT 1`,
      [authorId]
    );
    return result.rows[0] as CommunityPost;
  }

  static async deletePost(postId: number, requesterId: number, requesterRole: string): Promise<boolean> {
    const post = await this.getPostById(postId);
    if (!post) throw new Error('Post not found');
    if (post.author_id !== requesterId && requesterRole !== 'Admin' && requesterRole !== 'AgriculturalOfficer') {
      throw new Error('Forbidden');
    }
    await query('DELETE FROM community_posts WHERE id = ?', [postId]);
    return true;
  }

  static async pinPost(postId: number, pin: boolean): Promise<CommunityPost | null> {
    await query('UPDATE community_posts SET is_pinned = ? WHERE id = ?', [pin ? 1 : 0, postId]);
    return this.getPostById(postId);
  }

  // ─── Replies ──────────────────────────────────────────────────────────────

  static async getReplies(postId: number, userId?: number): Promise<CommunityReply[]> {
    const sql = `
      SELECT ${REPLY_COLS}
      ${userId ? `, (SELECT COUNT(*) FROM community_likes WHERE user_id = ? AND target_type = 'reply' AND target_id = cr.id) AS user_liked` : ''}
      FROM community_replies cr
      JOIN users u ON cr.author_id = u.id
      WHERE cr.post_id = ?
      ORDER BY cr.created_at ASC
    `;
    const params: any[] = userId ? [userId, postId] : [postId];
    const result = await query(sql, params);
    return result.rows as CommunityReply[];
  }

  static async createReply(postId: number, authorId: number, content: string): Promise<CommunityReply> {
    await query(
      `INSERT INTO community_replies (post_id, author_id, content) VALUES (?, ?, ?)`,
      [postId, authorId, content]
    );
    await query(
      `UPDATE community_posts SET replies_count = replies_count + 1 WHERE id = ?`,
      [postId]
    );
    const result = await query(
      `SELECT ${REPLY_COLS}
       FROM community_replies cr
       JOIN users u ON cr.author_id = u.id
       WHERE cr.author_id = ? AND cr.post_id = ?
       ORDER BY cr.id DESC LIMIT 1`,
      [authorId, postId]
    );
    return result.rows[0] as CommunityReply;
  }

  // ─── Likes ────────────────────────────────────────────────────────────────

  static async toggleLike(userId: number, targetType: 'post' | 'reply', targetId: number): Promise<{ liked: boolean; likes_count: number }> {
    const existing = await query(
      `SELECT id FROM community_likes WHERE user_id = ? AND target_type = ? AND target_id = ?`,
      [userId, targetType, targetId]
    );

    let liked: boolean;
    if (existing.rows.length > 0) {
      await query(
        `DELETE FROM community_likes WHERE user_id = ? AND target_type = ? AND target_id = ?`,
        [userId, targetType, targetId]
      );
      liked = false;
    } else {
      await query(
        `INSERT INTO community_likes (user_id, target_type, target_id) VALUES (?, ?, ?)`,
        [userId, targetType, targetId]
      );
      liked = true;
    }

    // Update denormalized count
    const countResult = await query(
      `SELECT COUNT(*) AS cnt FROM community_likes WHERE target_type = ? AND target_id = ?`,
      [targetType, targetId]
    );
    const cnt = (countResult.rows[0] as any).cnt as number;

    if (targetType === 'post') {
      await query(`UPDATE community_posts SET likes_count = ? WHERE id = ?`, [cnt, targetId]);
    } else {
      await query(`UPDATE community_replies SET likes_count = ? WHERE id = ?`, [cnt, targetId]);
    }

    return { liked, likes_count: cnt };
  }

  // ─── People directory ─────────────────────────────────────────────────────

  static async getOfficers(): Promise<any[]> {
    const result = await query(
      `SELECT id, first_name, last_name, role, profile_photo_url, created_at
       FROM users WHERE role = 'AgriculturalOfficer' AND status = 'Active'
       ORDER BY first_name ASC`,
      []
    );
    return result.rows;
  }

  static async getFarmers(): Promise<any[]> {
    const result = await query(
      `SELECT id, first_name, last_name, role, profile_photo_url, created_at
       FROM users WHERE role = 'Farmer' AND status = 'Active'
       ORDER BY first_name ASC`,
      []
    );
    return result.rows;
  }
}
