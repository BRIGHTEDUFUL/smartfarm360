import { query } from '../config/database';
import { AuthService } from './auth.service';

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: string;
  status: string;
  created_at: string;
}

interface UserFilters {
  search?: string;
  role?: string;
  status?: string;
  page?: number;
  limit?: number;
}

interface CreateUserData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: string;
  status?: string;
}

export class UserService {
  /**
   * Get all users with optional filtering and pagination
   */
  static async getAllUsers(filters: UserFilters = {}): Promise<{ users: User[]; total: number }> {
    const {
      search,
      role,
      status,
      page = 1,
      limit = 20
    } = filters;

    // Build WHERE clause
    const conditions: string[] = [];
    const params: any[] = [];

    if (search) {
      conditions.push('(first_name LIKE ? OR last_name LIKE ? OR email LIKE ?)');
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }

    if (role && role !== 'All') {
      conditions.push('role = ?');
      params.push(role);
    }

    if (status && status !== 'All') {
      conditions.push('status = ?');
      params.push(status);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) as total FROM users ${whereClause}`,
      params
    );
    const total = countResult.rows[0]?.total || 0;

    // Get paginated users
    const offset = (page - 1) * limit;
    const usersResult = await query(
      `SELECT id, email, first_name, last_name, phone, role, status, created_at
       FROM users
       ${whereClause}
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    return { users: usersResult.rows as User[], total };
  }

  /**
   * Create a new user
   */
  static async createUser(userData: CreateUserData): Promise<User> {
    const {
      email,
      password,
      first_name,
      last_name,
      phone,
      role,
      status = 'Active'
    } = userData;

    // Hash password
    const password_hash = await AuthService.hashPassword(password);

    // Insert user
    await query(
      `INSERT INTO users (email, password_hash, first_name, last_name, phone, role, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [email, password_hash, first_name, last_name, phone, role, status]
    );

    // Get created user
    const userResult = await query(
      'SELECT id, email, first_name, last_name, phone, role, status, created_at FROM users WHERE email = ?',
      [email]
    );

    return userResult.rows[0] as User;
  }

  /**
   * Update an existing user
   */
  static async updateUser(userId: number, updates: Partial<User>): Promise<User> {
    const allowedFields = ['first_name', 'last_name', 'email', 'phone', 'role', 'status'];
    const updateFields: string[] = [];
    const params: any[] = [];

    // Build UPDATE clause
    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key) && value !== undefined) {
        updateFields.push(`${key} = ?`);
        params.push(value);
      }
    }

    if (updateFields.length === 0) {
      throw new Error('No valid fields to update');
    }

    // Add userId to params
    params.push(userId);

    // Update user
    await query(
      `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
      params
    );

    // Get updated user
    const userResult = await query(
      'SELECT id, email, first_name, last_name, phone, role, status, created_at FROM users WHERE id = ?',
      [userId]
    );

    if (userResult.rows.length === 0) {
      throw new Error('User not found');
    }

    return userResult.rows[0] as User;
  }

  /**
   * Delete a user
   */
  static async deleteUser(userId: number): Promise<void> {
    await query('DELETE FROM users WHERE id = ?', [userId]);
  }

  /**
   * Check if email already exists
   */
  static async emailExists(email: string, excludeUserId?: number): Promise<boolean> {
    let sql = 'SELECT id FROM users WHERE email = ?';
    const params: any[] = [email];

    if (excludeUserId) {
      sql += ' AND id != ?';
      params.push(excludeUserId);
    }

    const result = await query(sql, params);
    return result.rows.length > 0;
  }

  /**
   * Get user by ID
   */
  static async getUserById(userId: number): Promise<User | null> {
    const result = await query(
      'SELECT id, email, first_name, last_name, phone, role, status, created_at FROM users WHERE id = ?',
      [userId]
    );

    return result.rows.length > 0 ? (result.rows[0] as User) : null;
  }
}
