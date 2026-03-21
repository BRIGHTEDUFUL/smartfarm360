import { query } from '../config/database';
import { CartService } from './cart.service';
import { ProductService } from './product.service';

export class OrderService {
  static async createOrder(userId: number, data: {
    payment_method: string;
    delivery_method: string;
    delivery_address?: string;
    notes?: string;
  }) {
    // Get cart items
    const cart = await CartService.getCart(userId);
    if (cart.items.length === 0) throw new Error('Cart is empty');

    // Validate stock for all items
    for (const item of cart.items) {
      if (item.stock_quantity < item.quantity) {
        throw new Error(`Insufficient stock for ${item.name}`);
      }
    }

    // Create order with "Pending Payment" status
    await query(
      `INSERT INTO orders (user_id, total_amount, payment_method, delivery_method, delivery_address, notes, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, cart.total, data.payment_method, data.delivery_method, data.delivery_address, data.notes, 'Pending Payment']
    );

    const orderResult = await query(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC LIMIT 1',
      [userId]
    );
    const order = orderResult.rows[0];

    // Create order items and reduce inventory
    for (const item of cart.items) {
      await query(
        `INSERT INTO order_items (order_id, product_id, farmer_id, quantity, price_at_purchase)
         VALUES (?, ?, ?, ?, ?)`,
        [order.id, item.product_id, item.farmer_id, item.quantity, item.price]
      );

      // Reduce inventory
      await ProductService.updateInventory(item.product_id, -item.quantity);
    }

    // Clear cart
    await CartService.clearCart(userId);

    return order;
  }

  static async getOrders(userId: number, role: string) {
    let sql = `
      SELECT o.*, 
        (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as item_count
      FROM orders o
    `;

    if (role === 'Consumer') {
      sql += ' WHERE o.user_id = ?';
    } else if (role === 'Farmer') {
      sql += ` WHERE o.id IN (
        SELECT DISTINCT order_id FROM order_items WHERE farmer_id = ?
      )`;
    }

    sql += ' ORDER BY o.created_at DESC';

    const result = await query(sql, [userId]);
    return result.rows;
  }

  static async getOrderById(orderId: number) {
    const orderResult = await query('SELECT * FROM orders WHERE id = ?', [orderId]);
    if (orderResult.rows.length === 0) return null;

    const order = orderResult.rows[0];

    const itemsResult = await query(
      `SELECT oi.*, p.name, p.unit
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`,
      [orderId]
    );

    return { ...order, items: itemsResult.rows };
  }

  static async updateStatus(orderId: number, status: string) {
    await query('UPDATE orders SET status = ? WHERE id = ?', [status, orderId]);
    return this.getOrderById(orderId);
  }

  static async cancelOrder(orderId: number) {
    const order = await this.getOrderById(orderId);
    if (!order) throw new Error('Order not found');

    if (order.status !== 'Pending Payment') {
      throw new Error('Only pending payment orders can be cancelled');
    }

    // Restore inventory
    for (const item of order.items) {
      await ProductService.updateInventory(item.product_id, item.quantity);
    }

    await query('UPDATE orders SET status = ? WHERE id = ?', ['Cancelled', orderId]);
    return this.getOrderById(orderId);
  }
}
