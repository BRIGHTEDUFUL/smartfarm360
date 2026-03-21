import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate); // All order routes require authentication

router.post('/', OrderController.create);
router.get('/', OrderController.getAll);
router.get('/:id', OrderController.getById);
router.put('/:id/status', authorize('Farmer', 'Admin'), OrderController.updateStatus);
router.put('/:id/cancel', OrderController.cancel);

export default router;
