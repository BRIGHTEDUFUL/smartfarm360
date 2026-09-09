import { Router } from 'express';
import { ConnectionController } from '../controllers/connection.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, ConnectionController.getConnections);
router.get('/pending', authenticate, ConnectionController.getPending);
router.post('/:userId', authenticate, ConnectionController.sendRequest);
router.put('/:connectionId', authenticate, ConnectionController.respond);

export default router;
