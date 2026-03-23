import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { ProductService } from '../services/product.service';

// Define valid categories
const VALID_CATEGORIES = ['Vegetables', 'Fruits', 'Grains', 'Poultry', 'Meat', 'Dairy', 'Spices'];
const VALID_UNITS = ['kg', 'piece', 'bunch', 'crate', 'bag', 'liter'];

export class ProductController {
  static createValidation = [
    body('name').trim().notEmpty().withMessage('Product name is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('category')
      .trim()
      .notEmpty().withMessage('Category is required')
      .isIn(VALID_CATEGORIES).withMessage(`Category must be one of: ${VALID_CATEGORIES.join(', ')}`),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('unit')
      .trim()
      .notEmpty().withMessage('Unit is required')
      .isIn(VALID_UNITS).withMessage(`Unit must be one of: ${VALID_UNITS.join(', ')}`),
    body('stock_quantity').isInt({ min: 0 }).withMessage('Stock quantity must be a non-negative integer'),
  ];

  static async create(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          error: { code: 'VALIDATION_FAILED', message: 'Input validation failed', details: errors.array() },
        });
        return;
      }

      // Handle image upload
      const image_url = req.file ? `/uploads/products/${req.file.filename}` : null;

      const product = await ProductService.createProduct({
        farmer_id: req.user!.id,
        ...req.body,
        image_url,
      });

      res.status(201).json({ success: true, data: product });
    } catch (error) {
      console.error('Create product error:', error);
      res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create product' },
      });
    }
  }

  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const { status, category, search, limit = '100', offset = '0' } = req.query;

      const products = await ProductService.getProducts({
        status: status as string,
        category: category as string,
        search: search as string,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
      });

      res.json({ success: true, data: products });
    } catch (error) {
      console.error('Get products error:', error);
      res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch products' },
      });
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const product = await ProductService.getProductById(parseInt(req.params.id));

      if (!product) {
        res.status(404).json({
          success: false,
          error: { code: 'NOT_FOUND', message: 'Product not found' },
        });
        return;
      }

      res.json({ success: true, data: product });
    } catch (error) {
      console.error('Get product error:', error);
      res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch product' },
      });
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const productId = parseInt(req.params.id);
      const product = await ProductService.getProductById(productId);

      if (!product) {
        res.status(404).json({
          success: false,
          error: { code: 'NOT_FOUND', message: 'Product not found' },
        });
        return;
      }

      // Check ownership (farmers can only update their own products)
      if (req.user!.role === 'Farmer' && product.farmer_id !== req.user!.id) {
        res.status(403).json({
          success: false,
          error: { code: 'FORBIDDEN', message: 'You can only update your own products' },
        });
        return;
      }

      // Handle image upload
      const updateData = { ...req.body };
      if (req.file) {
        updateData.image_url = `/uploads/products/${req.file.filename}`;
      }

      const updated = await ProductService.updateProduct(productId, updateData);
      res.json({ success: true, data: updated });
    } catch (error) {
      console.error('Update product error:', error);
      res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to update product' },
      });
    }
  }

  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const productId = parseInt(req.params.id);
      const product = await ProductService.getProductById(productId);

      if (!product) {
        res.status(404).json({
          success: false,
          error: { code: 'NOT_FOUND', message: 'Product not found' },
        });
        return;
      }

      // Check ownership
      if (req.user!.role === 'Farmer' && product.farmer_id !== req.user!.id) {
        res.status(403).json({
          success: false,
          error: { code: 'FORBIDDEN', message: 'You can only delete your own products' },
        });
        return;
      }

      await ProductService.deleteProduct(productId);
      res.json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
      console.error('Delete product error:', error);
      res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to delete product' },
      });
    }
  }

  static async approve(req: Request, res: Response): Promise<void> {
    try {
      const productId = parseInt(req.params.id);
      const updated = await ProductService.updateProduct(productId, { status: 'Active' });

      if (!updated) {
        res.status(404).json({
          success: false,
          error: { code: 'NOT_FOUND', message: 'Product not found' },
        });
        return;
      }

      res.json({ success: true, data: updated });
    } catch (error) {
      console.error('Approve product error:', error);
      res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to approve product' },
      });
    }
  }

  static async reject(req: Request, res: Response): Promise<void> {
    try {
      const productId = parseInt(req.params.id);
      const { reason } = req.body;

      const updated = await ProductService.updateProduct(productId, {
        status: 'Rejected',
        rejection_reason: reason,
      });

      if (!updated) {
        res.status(404).json({
          success: false,
          error: { code: 'NOT_FOUND', message: 'Product not found' },
        });
        return;
      }

      res.json({ success: true, data: updated });
    } catch (error) {
      console.error('Reject product error:', error);
      res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to reject product' },
      });
    }
  }
}
