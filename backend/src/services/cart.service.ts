import { query } from '../config/database';

export class CartService {
  static async getCart(userId: number) {
    const result = await query(
      `SELECT c.*, p.name, p.price, p.stock_quantity, p.status, p.unit
       FROM cart_items c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = ?`,
      [userId]
    );

    const items = result.rows;
    const total = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

    return { items, total };
  }

  static async addItem(userId: number, productId: number, quantity: number) {
    // Check if product exists and has stock
    const productResult = await query('SELECT * FROM products WHERE id = ?', [productId]);
    if (productResult.rows.length === 0) throw new Error('Product not found');

    const product = productResult.rows[0];
    if (product.stock_quantity < quantity) throw new Error('Insufficient stock');

    // Check if item already in cart
    const existingResult = await query(
      'SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    );

    if (existingResult.rows.length > 0) {
      // Update quantity
      const newQuantity = existingResult.rows[0].quantity + quantity;
      if (product.stock_quantity < newQuantity) throw new Error('Insufficient stock');

      await query(
        'UPDATE cart_items SET quantity = ? WHERE user_id = ? AND product_id = ?',
        [newQuantity, userId, productId]
      );
    } else {
      // Insert new item
      await query(
        'INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)',
        [userId, productId, quantity]
      );
    }

    return this.getCart(userId);
  }

  static async updateItem(userId: number, productId: number, quantity: number) {
    if (quantity <= 0) {
      return this.removeItem(userId, productId);
    }

    // Check stock
    const productResult = await query('SELECT stock_quantity FROM products WHERE id = ?', [productId]);
    if (productResult.rows.length === 0) throw new Error('Product not found');

    if (productResult.rows[0].stock_quantity < quantity) throw new Error('Insufficient stock');

    await query(
      'UPDATE cart_items SET quantity = ? WHERE user_id = ? AND product_id = ?',
      [quantity, userId, productId]
    );

    return this.getCart(userId);
  }

  static async removeItem(userId: number, productId: number) {
    await query('DELETE FROM cart_items WHERE user_id = ? AND product_id = ?', [userId, productId]);
    return this.getCart(userId);
  }

  static async clearCart(userId: number) {
    await query('DELETE FROM cart_items WHERE user_id = ?', [userId]);
  }
}
