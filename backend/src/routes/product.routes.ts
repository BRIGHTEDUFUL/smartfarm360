import { Router, Request, Response, NextFunction } from 'express';
import { ProductController } from '../controllers/product.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { auditMiddleware } from '../middleware/audit.middleware';
import { uploadSingle } from '../middleware/upload.middleware';
import multer from 'multer';

const router = Router();

// Multer error handler middleware
const handleMulterError = (err: any, _req: Request, res: Response, next: NextFunction): void => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      res.status(400).json({
        success: false,
        error: { code: 'FILE_TOO_LARGE', message: 'Image size must be less than 5MB' }
      });
      return;
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      res.status(400).json({
        success: false,
        error: { code: 'INVALID_FILE_FIELD', message: 'Unexpected file field' }
      });
      return;
    }
    res.status(400).json({
      success: false,
      error: { code: 'UPLOAD_ERROR', message: err.message }
    });
    return;
  }
  
  if (err && err.message && err.message.includes('Invalid file type')) {
    res.status(400).json({
      success: false,
      error: { code: 'INVALID_FILE_TYPE', message: err.message }
    });
    return;
  }
  
  next(err);
};

// Public routes
router.get('/', ProductController.getAll);
router.get('/:id', ProductController.getById);

// Farmer routes - with image upload
router.post(
  '/', 
  authenticate, 
  authorize('Farmer'), 
  uploadSingle,
  handleMulterError, // Handle upload errors
  ProductController.createValidation, 
  ProductController.create
);

router.put(
  '/:id', 
  authenticate, 
  authorize('Farmer', 'Admin'), 
  uploadSingle,
  handleMulterError, // Handle upload errors
  ProductController.update
);
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
