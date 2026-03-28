import { query } from '../config/database';

export interface Product {
  id: number;
  farmer_id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  unit: string;
  stock_quantity: number;
  status: 'Pending' | 'Active' | 'Rejected' | 'Inactive' | 'OutOfStock';
  rejection_reason?: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export class ProductService {
  static async createProduct(data: {
    farmer_id: number;
    name: string;
    description: string;
    category: string;
    price: number;
    unit: string;
    stock_quantity: number;
    image_url?: string;
  }): Promise<Product> {
    await query(
      `INSERT INTO products (farmer_id, name, description, category, price, unit, stock_quantity, image_url, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [data.farmer_id, data.name, data.description, data.category, data.price, data.unit, data.stock_quantity, data.image_url || null, 'Pending']
    );

    const result = await query(
      'SELECT * FROM products WHERE farmer_id = ? AND name = ? ORDER BY id DESC LIMIT 1',
      [data.farmer_id, data.name]
    );

    return result.rows[0] as Product;
  }

  static async getProductById(id: number): Promise<Product | null> {
    const result = await query('SELECT * FROM products WHERE id = ?', [id]);
    return result.rows.length > 0 ? (result.rows[0] as Product) : null;
  }

  static async getProducts(filters: {
    status?: string;
    category?: string;
    farmer_id?: number;
    search?: string;
    sort?: string;
    order?: string;
    limit?: number;
    offset?: number;
  }): Promise<Product[]> {
    let sql = 'SELECT * FROM products WHERE 1=1';
    const params: any[] = [];

    if (filters.status) {
      sql += ' AND status = ?';
      params.push(filters.status);
    }

    if (filters.category) {
      sql += ' AND category = ?';
      params.push(filters.category);
    }

    if (filters.farmer_id) {
      sql += ' AND farmer_id = ?';
      params.push(filters.farmer_id);
    }

    if (filters.search) {
      sql += ' AND (name LIKE ? OR description LIKE ?)';
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    // Handle sorting
    const sortField = filters.sort || 'created_at';
    const sortOrder = filters.order?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    
    // Validate sort field to prevent SQL injection
    const validSortFields = ['created_at', 'price', 'name', 'stock_quantity'];
    const safeSortField = validSortFields.includes(sortField) ? sortField : 'created_at';
    
    sql += ` ORDER BY ${safeSortField} ${sortOrder}`;

    if (filters.limit) {
      sql += ' LIMIT ?';
      params.push(filters.limit);
    }

    if (filters.offset) {
      sql += ' OFFSET ?';
      params.push(filters.offset);
    }

    const result = await query(sql, params);
    return result.rows as Product[];
  }

  static async updateProduct(id: number, data: Partial<Product>): Promise<Product | null> {
    const fields: string[] = [];
    const params: any[] = [];

    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'id' && key !== 'created_at' && key !== 'updated_at') {
        fields.push(`${key} = ?`);
        params.push(value);
      }
    });

    if (fields.length === 0) return null;

    params.push(id);
    await query(`UPDATE products SET ${fields.join(', ')} WHERE id = ?`, params);

    return this.getProductById(id);
  }

  static async deleteProduct(id: number): Promise<boolean> {
    await query('UPDATE products SET status = ? WHERE id = ?', ['Inactive', id]);
    return true;
  }

  static async updateInventory(id: number, quantity: number): Promise<void> {
    const product = await this.getProductById(id);
    if (!product) throw new Error('Product not found');

    const newQuantity = product.stock_quantity + quantity;
    const newStatus = newQuantity === 0 ? 'OutOfStock' : product.status;

    await query(
      'UPDATE products SET stock_quantity = ?, status = ? WHERE id = ?',
      [newQuantity, newStatus, id]
    );

    // Log inventory change
    await query(
      `INSERT INTO inventory_history (product_id, change_type, quantity_change, quantity_after)
       VALUES (?, ?, ?, ?)`,
      [id, quantity > 0 ? 'Restock' : 'Sale', quantity, newQuantity]
    );
  }
}
