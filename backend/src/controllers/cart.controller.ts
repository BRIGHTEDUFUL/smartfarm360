import { Request, Response } from 'express';
import { CartService } from '../services/cart.service';

export class CartController {
  static async getCart(req: Request, res: Response): Promise<void> {
    try {
      const cart = await CartService.getCart(req.user!.id);
      res.json({ success: true, data: cart });
    } catch (error) {
      console.error('Get cart error:', error);
      res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch cart' },
      });
    }
  }

  static async addItem(req: Request, res: Response): Promise<void> {
    try {
      const { product_id, quantity } = req.body;

      if (!product_id || !quantity || quantity <= 0) {
        res.status(400).json({
          success: false,
          error: { code: 'VALIDATION_FAILED', message: 'Invalid product_id or quantity' },
        });
        return;
      }

      const cart = await CartService.addItem(req.user!.id, product_id, quantity);
      res.json({ success: true, data: cart });
    } catch (error: any) {
      console.error('Add to cart error:', error);
      res.status(400).json({
        success: false,
        error: { code: 'BAD_REQUEST', message: error.message || 'Failed to add item to cart' },
      });
    }
  }

  static async updateItem(req: Request, res: Response): Promise<void> {
    try {
      const productId = parseInt(req.params.productId);
      const { quantity } = req.body;

      if (!quantity || quantity < 0) {
        res.status(400).json({
          success: false,
          error: { code: 'VALIDATION_FAILED', message: 'Invalid quantity' },
        });
        return;
      }

      const cart = await CartService.updateItem(req.user!.id, productId, quantity);
      res.json({ success: true, data: cart });
    } catch (error: any) {
      console.error('Update cart error:', error);
      res.status(400).json({
        success: false,
        error: { code: 'BAD_REQUEST', message: error.message || 'Failed to update cart item' },
      });
    }
  }

  static async removeItem(req: Request, res: Response): Promise<void> {
    try {
      const productId = parseInt(req.params.productId);
      const cart = await CartService.removeItem(req.user!.id, productId);
      res.json({ success: true, data: cart });
    } catch (error) {
      console.error('Remove from cart error:', error);
      res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to remove item from cart' },
      });
    }
  }

  static async clearCart(req: Request, res: Response): Promise<void> {
    try {
      await CartService.clearCart(req.user!.id);
      res.json({ success: true, message: 'Cart cleared successfully' });
    } catch (error) {
      console.error('Clear cart error:', error);
      res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to clear cart' },
      });
    }
  }
}
