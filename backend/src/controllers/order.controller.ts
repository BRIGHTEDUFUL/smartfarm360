import { Request, Response } from 'express';
import { OrderService } from '../services/order.service';

export class OrderController {
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const order = await OrderService.createOrder(req.user!.id, req.body);
      res.status(201).json({ success: true, data: order });
    } catch (error: any) {
      console.error('Create order error:', error);
      res.status(400).json({
        success: false,
        error: { code: 'BAD_REQUEST', message: error.message || 'Failed to create order' },
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
        error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch orders' },
      });
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const order = await OrderService.getOrderById(parseInt(req.params.id));

      if (!order) {
        res.status(404).json({
          success: false,
          error: { code: 'NOT_FOUND', message: 'Order not found' },
        });
        return;
      }

      res.json({ success: true, data: order });
    } catch (error) {
      console.error('Get order error:', error);
      res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch order' },
      });
    }
  }

  static async updateStatus(req: Request, res: Response): Promise<void> {
    try {
      const { status } = req.body;
      const order = await OrderService.updateStatus(parseInt(req.params.id), status);
      res.json({ success: true, data: order });
    } catch (error) {
      console.error('Update order status error:', error);
      res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to update order status' },
      });
    }
  }

  static async cancel(req: Request, res: Response): Promise<void> {
    try {
      const order = await OrderService.cancelOrder(parseInt(req.params.id));
      res.json({ success: true, data: order });
    } catch (error: any) {
      console.error('Cancel order error:', error);
      res.status(400).json({
        success: false,
        error: { code: 'BAD_REQUEST', message: error.message || 'Failed to cancel order' },
      });
    }
  }
}
