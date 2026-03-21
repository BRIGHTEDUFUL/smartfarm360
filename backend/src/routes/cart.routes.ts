import { Router } from 'express';
import { CartController } from '../controllers/cart.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate); // All cart routes require authentication

router.get('/', CartController.getCart);
router.post('/', CartController.addItem);
router.put('/:productId', CartController.updateItem);
router.delete('/:productId', CartController.removeItem);
router.delete('/', CartController.clearCart);

export default router;
