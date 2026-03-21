import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { auditMiddleware } from '../middleware/audit.middleware';

const router = Router();

/**
 * GET /api/users
 * Get all users with optional filtering
 * Auth: Admin only
 */
router.get(
  '/',
  authenticate,
  authorize('Admin'),
  UserController.getAllUsers
);

/**
 * POST /api/users
 * Create a new user
 * Auth: Admin only
 * Audit: Logs CREATE action for USER entity
 */
router.post(
  '/',
  authenticate,
  authorize('Admin'),
  auditMiddleware({
    action_type: 'CREATE',
    entity_type: 'USER',
    getEntityId: (_req, _res, body) => body.data?.user?.id || 0,
    getDetails: (req, _res, _body) => ({
      name: `${req.body.first_name} ${req.body.last_name}`,
      email: req.body.email,
      role: req.body.role
    })
  }),
  UserController.createUser
);

/**
 * PUT /api/users/:id
 * Update an existing user
 * Auth: Admin only
 * Audit: Logs UPDATE action for USER entity with changed fields
 */
router.put(
  '/:id',
  authenticate,
  authorize('Admin'),
  auditMiddleware({
    action_type: 'UPDATE',
    entity_type: 'USER',
    getEntityId: (req) => parseInt(req.params.id),
    getDetails: (_req, _res, body) => ({
      name: body.data?.user ? `${body.data.user.first_name} ${body.data.user.last_name}` : '',
      email: body.data?.user?.email || '',
      changes: body.data?.changes || {}
    })
  }),
  UserController.updateUser
);

/**
 * DELETE /api/users/:id
 * Delete a user
 * Auth: Admin only
 * Audit: Logs DELETE action for USER entity
 */
router.delete(
  '/:id',
  authenticate,
  authorize('Admin'),
  auditMiddleware({
    action_type: 'DELETE',
    entity_type: 'USER',
    getEntityId: (req) => parseInt(req.params.id),
    getDetails: (_req, _res, body) => ({
      name: body.data?.deletedUser?.name || '',
      email: body.data?.deletedUser?.email || ''
    })
  }),
  UserController.deleteUser
);

export default router;
