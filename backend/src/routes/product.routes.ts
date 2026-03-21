import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { auditMiddleware } from '../middleware/audit.middleware';

const router = Router();

// Public routes
router.get('/', ProductController.getAll);
router.get('/:id', ProductController.getById);

// Farmer routes
router.post('/', authenticate, authorize('Farmer'), ProductController.createValidation, ProductController.create);
router.put('/:id', authenticate, authorize('Farmer', 'Admin'), ProductController.update);
router.delete(
  '/:id',
  authenticate,
  authorize('Farmer', 'Admin'),
  auditMiddleware({
    action_type: 'DELETE',
    entity_type: 'PRODUCT',
    getEntityId: (req) => parseInt(req.params.id),
    getDetails: (_req, _res, body) => ({
      name: body.data?.product?.name || ''
    })
  }),
  ProductController.delete
);

// Admin routes
router.put(
  '/:id/approve',
  authenticate,
  authorize('Admin'),
  auditMiddleware({
    action_type: 'APPROVE',
    entity_type: 'PRODUCT',
    getEntityId: (req) => parseInt(req.params.id),
    getDetails: (_req, _res, body) => ({
      name: body.data?.product?.name || ''
    })
  }),
  ProductController.approve
);

router.put(
  '/:id/reject',
  authenticate,
  authorize('Admin'),
  auditMiddleware({
    action_type: 'REJECT',
    entity_type: 'PRODUCT',
    getEntityId: (req) => parseInt(req.params.id),
    getDetails: (req, _res, _body) => ({
      name: req.body.name || '',
      reason: req.body.reason || ''
    })
  }),
  ProductController.reject
);

export default router;
