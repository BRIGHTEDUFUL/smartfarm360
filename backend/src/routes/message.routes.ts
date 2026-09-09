import { Router } from 'express';
import { MessageController } from '../controllers/message.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, MessageController.getConversations);
router.get('/unread-count', authenticate, MessageController.getUnreadCount);
router.get('/:partnerId', authenticate, MessageController.getMessages);
router.post('/:partnerId', authenticate, MessageController.sendValidation, MessageController.sendMessage);
router.put('/:partnerId/read', authenticate, MessageController.markRead);

export default router;
