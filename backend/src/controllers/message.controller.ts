import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { MessageService } from '../services/message.service';

export class MessageController {
  static sendValidation = [
    body('content').trim().notEmpty().withMessage('Message content is required').isLength({ max: 2000 }).withMessage('Message too long'),
  ];

  // GET /api/messages — list conversations
  static async getConversations(req: Request, res: Response): Promise<void> {
    try {
      const conversations = await MessageService.getConversations(req.user!.id);
      res.json({ success: true, data: conversations });
    } catch (err) {
      res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch conversations' } });
    }
  }

  // GET /api/messages/:partnerId — chat history
  static async getMessages(req: Request, res: Response): Promise<void> {
    try {
      const partnerId = parseInt(req.params.partnerId);
      const limit = parseInt((req.query.limit as string) || '50');
      const offset = parseInt((req.query.offset as string) || '0');
      const messages = await MessageService.getMessages(req.user!.id, partnerId, limit, offset);
      // Auto-mark as read
      await MessageService.markRead(req.user!.id, partnerId);
      res.json({ success: true, data: messages });
    } catch (err) {
      res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch messages' } });
    }
  }

  // POST /api/messages/:partnerId — send message
  static async sendMessage(req: Request, res: Response): Promise<void> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, error: { code: 'VALIDATION_FAILED', message: 'Validation failed', details: errors.array() } });
      return;
    }
    try {
      const receiverId = parseInt(req.params.partnerId);
      const message = await MessageService.sendMessage(req.user!.id, receiverId, req.body.content);
      res.status(201).json({ success: true, data: message });
    } catch (err: any) {
      if (err.message === 'Recipient not found') {
        res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Recipient not found' } });
      } else if (err.message === 'Cannot send message to yourself') {
        res.status(400).json({ success: false, error: { code: 'INVALID_REQUEST', message: 'Cannot send message to yourself' } });
      } else {
        res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to send message' } });
      }
    }
  }

  // PUT /api/messages/:partnerId/read
  static async markRead(req: Request, res: Response): Promise<void> {
    try {
      await MessageService.markRead(req.user!.id, parseInt(req.params.partnerId));
      res.json({ success: true, message: 'Messages marked as read' });
    } catch (err) {
      res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to mark as read' } });
    }
  }

  // GET /api/messages/unread-count
  static async getUnreadCount(req: Request, res: Response): Promise<void> {
    try {
      const count = await MessageService.getUnreadCount(req.user!.id);
      res.json({ success: true, data: { count } });
    } catch (err) {
      res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to get unread count' } });
    }
  }
}
