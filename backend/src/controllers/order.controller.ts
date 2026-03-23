import { Request, Response } from 'express';
import { OrderService } from '../services/order.service';

// Valid order statuses
const VALID_ORDER_STATUSES = [
  'Pending Payment',
  'Processing',
  'Completed',
  'Cancelled',
  'Pending',
  'Shipped',
  'Delivered'
];

export class OrderController {
  static async create(req: Request, res: Response): Promise<void> {
    try {
      // Validate required fields
      const { payment_method, delivery_method } = req.body;

      if (!payment_method) {
        res.status(400).json({
          success: false,
          error: { 
            code: 'VALIDATION_ERROR', 
            message: 'Payment method is required' 
          },
        });
        return;
      }

      if (!delivery_method) {
        res.status(400).json({
          success: false,
          error: { 
            code: 'VALIDATION_ERROR', 
            message: 'Delivery method is required' 
          },
        });
        return;
      }

      // Create order
      const order = await OrderService.createOrder(req.user!.id, req.body);
      
      res.status(201).json({ 
        success: true, 
        data: order,
        message: 'Order created successfully'
      });
    } catch (error: any) {
      console.error('Create order error:', error);
      
      // Get error message safely
      const errorMessage = error?.message || String(error);
      
      // Handle specific error cases
      if (errorMessage.includes('Cart is empty')) {
        res.status(400).json({
          success: false,
          error: { 
            code: 'EMPTY_CART', 
            message: 'Your cart is empty. Please add items before placing an order.' 
          },
        });
        return;
      }

      if (errorMessage.includes('Insufficient stock')) {
        res.status(400).json({
          success: false,
          error: { 
            code: 'INSUFFICIENT_STOCK', 
            message: errorMessage 
          },
        });
        return;
      }

      if (errorMessage.includes('CHECK constraint failed')) {
        res.status(500).json({
          success: false,
          error: { 
            code: 'DATABASE_ERROR', 
            message: 'Invalid order status. Please contact support.' 
          },
        });
        return;
      }

      res.status(400).json({
        success: false,
        error: { 
          code: 'BAD_REQUEST', 
          message: errorMessage || 'Failed to create order. Please try again.' 
        },
      });
    }
  }

  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const orders = await OrderService.getOrders(req.user!.id, req.user!.role);
      res.json({ success: true, data: orders });
    } catch (error) {
      console.error('Get orders error:', error);
      res.status(500).json({
        success: false,
        error: { 
          code: 'INTERNAL_SERVER_ERROR', 
          message: 'Failed to fetch orders. Please try again.' 
        },
      });
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const orderId = parseInt(req.params.id);

      if (isNaN(orderId)) {
        res.status(400).json({
          success: false,
          error: { 
            code: 'INVALID_ID', 
            message: 'Invalid order ID' 
          },
        });
        return;
      }

      const order = await OrderService.getOrderById(orderId);

      if (!order) {
        res.status(404).json({
          success: false,
          error: { 
            code: 'NOT_FOUND', 
            message: 'Order not found' 
          },
        });
        return;
      }

      res.json({ success: true, data: order });
    } catch (error) {
      console.error('Get order error:', error);
      res.status(500).json({
        success: false,
        error: { 
          code: 'INTERNAL_SERVER_ERROR', 
          message: 'Failed to fetch order. Please try again.' 
        },
      });
    }
  }

  static async updateStatus(req: Request, res: Response): Promise<void> {
    try {
      const { status } = req.body;
      const orderId = parseInt(req.params.id);

      if (isNaN(orderId)) {
        res.status(400).json({
          success: false,
          error: { 
            code: 'INVALID_ID', 
            message: 'Invalid order ID' 
          },
        });
        return;
      }

      if (!status) {
        res.status(400).json({
          success: false,
          error: { 
            code: 'VALIDATION_ERROR', 
            message: 'Status is required' 
          },
        });
        return;
      }

      if (!VALID_ORDER_STATUSES.includes(status)) {
        res.status(400).json({
          success: false,
          error: { 
            code: 'INVALID_STATUS', 
            message: `Invalid status. Must be one of: ${VALID_ORDER_STATUSES.join(', ')}` 
          },
        });
        return;
      }

      const order = await OrderService.updateStatus(orderId, status);
      
      res.json({ 
        success: true, 
        data: order,
        message: `Order status updated to ${status}`
      });
    } catch (error: any) {
      console.error('Update order status error:', error);
      res.status(500).json({
        success: false,
        error: { 
          code: 'INTERNAL_SERVER_ERROR', 
          message: error.message || 'Failed to update order status. Please try again.' 
        },
      });
    }
  }

  static async cancel(req: Request, res: Response): Promise<void> {
    try {
      const orderId = parseInt(req.params.id);

      if (isNaN(orderId)) {
        res.status(400).json({
          success: false,
          error: { 
            code: 'INVALID_ID', 
            message: 'Invalid order ID' 
          },
        });
        return;
      }

      const order = await OrderService.cancelOrder(orderId);
      
      res.json({ 
        success: true, 
        data: order,
        message: 'Order cancelled successfully'
      });
    } catch (error: any) {
      console.error('Cancel order error:', error);

      if (error.message.includes('not found')) {
        res.status(404).json({
          success: false,
          error: { 
            code: 'NOT_FOUND', 
            message: 'Order not found' 
          },
        });
        return;
      }

      if (error.message.includes('Only pending')) {
        res.status(400).json({
          success: false,
          error: { 
            code: 'INVALID_STATUS', 
            message: error.message 
          },
        });
        return;
      }

      res.status(400).json({
        success: false,
        error: { 
          code: 'BAD_REQUEST', 
          message: error.message || 'Failed to cancel order. Please try again.' 
        },
      });
    }
  }
}
