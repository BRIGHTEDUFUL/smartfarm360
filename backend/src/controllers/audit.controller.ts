import { Request, Response } from 'express';
import { AuditService } from '../services/audit.service';

export class AuditController {
  /**
   * Get audit logs with optional filtering
   * GET /api/audit-logs
   */
  static async getAuditLogs(req: Request, res: Response): Promise<void> {
    try {
      const { actionType, entityType, fromDate, toDate, page, limit } = req.query;

      const filters = {
        actionType: actionType as string,
        entityType: entityType as string,
        fromDate: fromDate as string,
        toDate: toDate as string,
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined
      };

      const { logs, total } = await AuditService.getAuditLogs(filters);
      const currentPage = filters.page || 1;
      const pageLimit = filters.limit || 50;
      const totalPages = Math.ceil(total / pageLimit);

      res.status(200).json({
        success: true,
        data: {
          logs,
          total,
          page: currentPage,
          totalPages
        }
      });
    } catch (error) {
      console.error('Get audit logs error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to retrieve audit logs'
        }
      });
    }
  }
}
