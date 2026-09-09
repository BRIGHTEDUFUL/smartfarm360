import { Router } from 'express';
import { CommunityController } from '../controllers/community.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

// Public
router.get('/posts', CommunityController.getPosts);
router.get('/posts/:id', CommunityController.getPost);
router.get('/posts/:id/replies', CommunityController.getReplies);
router.get('/officers', CommunityController.getOfficers);
router.get('/farmers', authenticate, CommunityController.getFarmers);

// Authenticated — Farmer, AgriculturalOfficer, Admin can post/reply/like
router.post(
  '/posts',
  authenticate,
  authorize('Farmer', 'AgriculturalOfficer', 'Admin'),
  CommunityController.createPostValidation,
  CommunityController.createPost
);

router.delete('/posts/:id', authenticate, CommunityController.deletePost);

router.post(
  '/posts/:id/replies',
  authenticate,
  authorize('Farmer', 'AgriculturalOfficer', 'Admin', 'Consumer'),
  CommunityController.createReplyValidation,
  CommunityController.createReply
);

router.post('/posts/:id/like', authenticate, CommunityController.toggleLike);

// Admin / Officer only — pin posts
router.put(
  '/posts/:id/pin',
  authenticate,
  authorize('Admin', 'AgriculturalOfficer'),
  CommunityController.pinPost
);

export default router;
