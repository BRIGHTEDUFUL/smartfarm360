import { Router } from 'express';
import { AuditController } from '../controllers/audit.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

/**
 * GET /api/audit-logs
 * Get audit logs with optional filtering
 * Auth: Admin only
 */
router.get(
  '/',
  authenticate,
  authorize('Admin'),
  AuditController.getAuditLogs
);

export default router;
