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
    console.log('=== ORDER CREATION START ===');
    console.log('User ID:', userId);
    console.log('Order Data:', data);

    try {
      // Get cart items
      console.log('Fetching cart items...');
      const cart = await CartService.getCart(userId);
      console.log('Cart items:', cart.items.length);
      console.log('Cart total:', cart.total);

      if (cart.items.length === 0) {
        console.error('Cart is empty');
        throw new Error('Cart is empty');
      }

      // Validate stock for all items
      console.log('Validating stock...');
      for (const item of cart.items) {
        console.log(`Checking stock for ${item.name}: ${item.stock_quantity} available, ${item.quantity} requested`);
        if (item.stock_quantity < item.quantity) {
          throw new Error(`Insufficient stock for ${item.name}`);
        }
      }

      // Create order with "Pending Payment" status
      console.log('Creating order in database...');
      console.log('Order data to insert:', {
        user_id: userId,
        total_amount: cart.total,
        payment_method: data.payment_method,
        delivery_method: data.delivery_method,
        delivery_address: data.delivery_address || '',
        notes: data.notes || '',
        status: 'Pending Payment'
      });
      
      const insertResult = await query(
        `INSERT INTO orders (user_id, total_amount, payment_method, delivery_method, delivery_address, notes, status, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
        [userId, cart.total, data.payment_method, data.delivery_method, data.delivery_address || '', data.notes || '', 'Pending Payment']
      );
      console.log('Order insert result:', insertResult);

      // Get the created order - SQLite doesn't return lastInsertId easily with sql.js
      // So we query for the most recent order for this user with matching total
      const orderResult = await query(
        `SELECT * FROM orders 
         WHERE user_id = ? 
         AND total_amount = ? 
         AND status = 'Pending Payment'
         ORDER BY created_at DESC, id DESC 
         LIMIT 1`,
        [userId, cart.total]
      );
      
      console.log('Order query result:', orderResult);
      
      if (orderResult.rows.length === 0) {
        console.error('Failed to retrieve created order');
        console.error('Attempting to query all recent orders for user:', userId);
        const allOrders = await query(
          'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC, id DESC LIMIT 5',
          [userId]
        );
        console.error('Recent orders:', allOrders.rows);
        throw new Error('Failed to create order - order not found after insert');
      }

      const order = orderResult.rows[0];
      console.log('Order created with ID:', order.id);
      console.log('Order details:', order);

      // Create order items and reduce inventory
      console.log('Creating order items...');
      for (const item of cart.items) {
        console.log(`Adding item: ${item.name} (Product ID: ${item.product_id}, Farmer ID: ${item.farmer_id})`);
        
        await query(
          `INSERT INTO order_items (order_id, product_id, farmer_id, quantity, price_at_purchase)
           VALUES (?, ?, ?, ?, ?)`,
          [order.id, item.product_id, item.farmer_id, item.quantity, item.price]
        );

        // Reduce inventory
        console.log(`Reducing inventory for product ${item.product_id} by ${item.quantity}`);
        await ProductService.updateInventory(item.product_id, -item.quantity);
      }

      // Clear cart
      console.log('Clearing cart...');
      await CartService.clearCart(userId);

      console.log('=== ORDER CREATION SUCCESS ===');
      console.log('Order ID:', order.id);
      console.log('Total Amount:', order.total_amount);
      console.log('Status:', order.status);

      return order;
    } catch (error) {
      console.error('=== ORDER CREATION FAILED ===');
      console.error('Error:', error);
      throw error;
    }
  }

  static async getOrders(userId: number, role: string) {
    let sql = `
      SELECT o.*, 
        (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as item_count
      FROM orders o
    `;
    const params: number[] = [];

    if (role === 'Consumer') {
      sql += ' WHERE o.user_id = ?';
      params.push(userId);
    } else if (role === 'Farmer') {
      sql += ` WHERE o.id IN (
        SELECT DISTINCT order_id FROM order_items WHERE farmer_id = ?
      )`;
      params.push(userId);
    }

    sql += ' ORDER BY o.created_at DESC';

    const result = await query(sql, params);
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
