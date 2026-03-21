import { query } from '../config/database';

interface AuditLogEntry {
  user_id: number;
  action_type: string;
  entity_type: string;
  entity_id: number;
  details: Record<string, any>;
  ip_address: string;
}

interface AuditLog {
  id: number;
  user_id: number;
  admin_name: string;
  action_type: string;
  entity_type: string;
  entity_id: number;
  entity_name: string;
  details: Record<string, any>;
  ip_address: string;
  created_at: string;
}

interface AuditFilters {
  actionType?: string;
  entityType?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
}

export class AuditService {
  /**
   * Create a new audit log entry
   */
  static async createAuditLog(entry: AuditLogEntry): Promise<void> {
    try {
      const detailsJson = JSON.stringify(entry.details);
      
      await query(
        `INSERT INTO audit_logs (user_id, action_type, entity_type, entity_id, details, ip_address)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          entry.user_id,
          entry.action_type,
          entry.entity_type,
          entry.entity_id,
          detailsJson,
          entry.ip_address
        ]
      );
    } catch (error) {
      console.error('Failed to create audit log:', error);
      // Don't throw - audit logging should not break the main operation
    }
  }

  /**
   * Retrieve audit logs with filtering and pagination
   */
  static async getAuditLogs(filters: AuditFilters = {}): Promise<{ logs: AuditLog[]; total: number }> {
    const {
      actionType,
      entityType,
      fromDate,
      toDate,
      page = 1,
      limit = 50
    } = filters;

    // Build WHERE clause
    const conditions: string[] = [];
    const params: any[] = [];

    if (actionType && actionType !== 'All') {
      conditions.push('a.action_type = ?');
      params.push(actionType);
    }

    if (entityType && entityType !== 'All') {
      conditions.push('a.entity_type = ?');
      params.push(entityType);
    }

    if (fromDate) {
      conditions.push('a.created_at >= ?');
      params.push(fromDate);
    }

    if (toDate) {
      conditions.push('a.created_at <= ?');
      params.push(toDate);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) as total FROM audit_logs a ${whereClause}`,
      params
    );
    const total = countResult.rows[0]?.total || 0;

    // Get paginated logs with user names
    const offset = (page - 1) * limit;
    const logsResult = await query(
      `SELECT 
        a.id,
        a.user_id,
        u.first_name || ' ' || u.last_name as admin_name,
        a.action_type,
        a.entity_type,
        a.entity_id,
        a.details,
        a.ip_address,
        a.created_at
       FROM audit_logs a
       LEFT JOIN users u ON a.user_id = u.id
       ${whereClause}
       ORDER BY a.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    // Parse details JSON and format logs
    const logs = logsResult.rows.map((row: any) => ({
      ...row,
      details: row.details ? JSON.parse(row.details) : {},
      entity_name: row.details ? JSON.parse(row.details).name || '' : ''
    }));

    return { logs, total };
  }

  /**
   * Format audit log details for display
   */
  static formatAuditDetails(log: AuditLog): string {
    const { action_type, entity_type, details } = log;

    switch (action_type) {
      case 'CREATE':
        return `Created ${entity_type.toLowerCase()} "${details.name || details.email || log.entity_id}"`;
      
      case 'UPDATE':
        const changes = details.changes || {};
        const changeList = Object.keys(changes).join(', ');
        return `Updated ${entity_type.toLowerCase()} "${details.name || details.email || log.entity_id}" (${changeList})`;
      
      case 'DELETE':
        return `Deleted ${entity_type.toLowerCase()} "${details.name || details.email || log.entity_id}"`;
      
      case 'APPROVE':
        return `Approved ${entity_type.toLowerCase()} "${details.name || log.entity_id}"`;
      
      case 'REJECT':
        return `Rejected ${entity_type.toLowerCase()} "${details.name || log.entity_id}"${details.reason ? `: ${details.reason}` : ''}`;
      
      default:
        return `${action_type} ${entity_type.toLowerCase()} ${log.entity_id}`;
    }
  }
}
