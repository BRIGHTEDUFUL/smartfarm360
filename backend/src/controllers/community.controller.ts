import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { CommunityService } from '../services/community.service';

export class CommunityController {
  // Validation
  static createPostValidation = [
    body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 200 }).withMessage('Title too long'),
    body('content').trim().notEmpty().withMessage('Content is required'),
    body('category').isIn(['General', 'Pest Control', 'Soil Health', 'Weather', 'Market Prices', 'Irrigation', 'Seeds & Planting', 'Q&A'])
      .withMessage('Invalid category'),
  ];

  static createReplyValidation = [
    body('content').trim().notEmpty().withMessage('Reply content is required'),
  ];

  // GET /api/community/posts
  static async getPosts(req: Request, res: Response): Promise<void> {
    try {
      const { category, search, authorId, limit = '20', offset = '0' } = req.query;
      const userId = req.user?.id;

      const posts = await CommunityService.getPosts({
        category: category as string,
        search: search as string,
        authorId: authorId ? parseInt(authorId as string) : undefined,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
        userId,
      });
      res.json({ success: true, data: posts });
    } catch (err) {
      res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch posts' } });
    }
  }

  // GET /api/community/posts/:id
  static async getPost(req: Request, res: Response): Promise<void> {
    try {
      const post = await CommunityService.getPostById(parseInt(req.params.id), req.user?.id);
      if (!post) {
        res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Post not found' } });
        return;
      }
      res.json({ success: true, data: post });
    } catch (err) {
      res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch post' } });
    }
  }

  // POST /api/community/posts
  static async createPost(req: Request, res: Response): Promise<void> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, error: { code: 'VALIDATION_FAILED', message: 'Validation failed', details: errors.array() } });
      return;
    }
    try {
      const post = await CommunityService.createPost(req.user!.id, req.body);
      res.status(201).json({ success: true, data: post });
    } catch (err) {
      res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create post' } });
    }
  }

  // DELETE /api/community/posts/:id
  static async deletePost(req: Request, res: Response): Promise<void> {
    try {
      await CommunityService.deletePost(parseInt(req.params.id), req.user!.id, req.user!.role);
      res.json({ success: true, message: 'Post deleted' });
    } catch (err: any) {
      if (err.message === 'Post not found') {
        res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Post not found' } });
      } else if (err.message === 'Forbidden') {
        res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'You cannot delete this post' } });
      } else {
        res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to delete post' } });
      }
    }
  }

  // GET /api/community/posts/:id/replies
  static async getReplies(req: Request, res: Response): Promise<void> {
    try {
      const replies = await CommunityService.getReplies(parseInt(req.params.id), req.user?.id);
      res.json({ success: true, data: replies });
    } catch (err) {
      res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch replies' } });
    }
  }

  // POST /api/community/posts/:id/replies
  static async createReply(req: Request, res: Response): Promise<void> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, error: { code: 'VALIDATION_FAILED', message: 'Validation failed', details: errors.array() } });
      return;
    }
    try {
      const reply = await CommunityService.createReply(parseInt(req.params.id), req.user!.id, req.body.content);
      res.status(201).json({ success: true, data: reply });
    } catch (err) {
      res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create reply' } });
    }
  }

  // POST /api/community/posts/:id/like
  static async toggleLike(req: Request, res: Response): Promise<void> {
    try {
      const { targetType = 'post', targetId } = req.body;
      const id = targetId ? parseInt(targetId) : parseInt(req.params.id);
      const type = (targetType === 'reply') ? 'reply' : 'post';
      const result = await CommunityService.toggleLike(req.user!.id, type, id);
      res.json({ success: true, data: result });
    } catch (err) {
      res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to toggle like' } });
    }
  }

  // PUT /api/community/posts/:id/pin
  static async pinPost(req: Request, res: Response): Promise<void> {
    try {
      const pin = req.body.pin !== false; // default true
      const post = await CommunityService.pinPost(parseInt(req.params.id), pin);
      res.json({ success: true, data: post });
    } catch (err) {
      res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to pin post' } });
    }
  }

  // GET /api/community/officers
  static async getOfficers(_req: Request, res: Response): Promise<void> {
    try {
      const officers = await CommunityService.getOfficers();
      res.json({ success: true, data: officers });
    } catch (err) {
      res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch officers' } });
    }
  }

  // GET /api/community/farmers
  static async getFarmers(_req: Request, res: Response): Promise<void> {
    try {
      const farmers = await CommunityService.getFarmers();
      res.json({ success: true, data: farmers });
    } catch (err) {
      res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch farmers' } });
    }
  }
}
