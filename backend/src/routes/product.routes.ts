import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.get('/', ProductController.getAll);
router.get('/:id', ProductController.getById);

// Farmer routes
router.post('/', authenticate, authorize('Farmer'), ProductController.createValidation, ProductController.create);
router.put('/:id', authenticate, authorize('Farmer', 'Admin'), ProductController.update);
router.delete('/:id', authenticate, authorize('Farmer', 'Admin'), ProductController.delete);

// Admin routes
router.put('/:id/approve', authenticate, authorize('Admin'), ProductController.approve);
router.put('/:id/reject', authenticate, authorize('Admin'), ProductController.reject);

export default router;
