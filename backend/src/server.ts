import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import { initDatabase, query, saveDatabase, db } from './config/database';
import { runMigrations } from './config/migrate';
import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes';
import cartRoutes from './routes/cart.routes';
import orderRoutes from './routes/order.routes';
import userRoutes from './routes/user.routes';
import auditRoutes from './routes/audit.routes';
import { errorHandler } from './middleware/errorHandler';
import { AuthService } from './services/auth.service';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Allow inline scripts for React
}));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/audit-logs', auditRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Smart Farming 360 API is running' });
});

// Serve static files from frontend build (production)
const frontendDistPath = path.join(__dirname, '../../frontend/dist');
console.log('Frontend dist path:', frontendDistPath);
app.use(express.static(frontendDistPath));

// Error handler for API routes only
app.use('/api/*', errorHandler);

// Serve index.html for all non-API routes (SPA support)
app.get('*', (_req, res) => {
  const indexPath = path.join(frontendDistPath, 'index.html');
  console.log('Serving index.html from:', indexPath);
  res.sendFile(indexPath);
});

// Seed database with initial data
async function seedDatabase() {
  try {
    // Ensure database is initialized
    if (!db) {
      console.log('Database not initialized, initializing now...');
      await initDatabase();
    }
    
    console.log('Database instance exists:', !!db);
    console.log('Checking for existing admin...');
    
    // Check if users already exist
    const existingAdmin = await query('SELECT id FROM users WHERE email = ?', ['admin@smartfarming.com']);
    
    if (existingAdmin.rows.length === 0) {
      console.log('Seeding database with initial data...');
      
      // Create admin user
      const adminPassword = await AuthService.hashPassword('admin123');
      await query(
        `INSERT INTO users (email, password_hash, first_name, last_name, phone, role, status)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        ['admin@smartfarming.com', adminPassword, 'Admin', 'User', '+233501234567', 'Admin', 'Active']
      );
      console.log('✓ Admin user created');

      // Create farmer users
      const farmerPassword = await AuthService.hashPassword('farmer123');
      await query(
        `INSERT INTO users (email, password_hash, first_name, last_name, phone, role, status)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        ['farmer1@test.com', farmerPassword, 'Kwame', 'Mensah', '+233501234568', 'Farmer', 'Active']
      );
      await query(
        `INSERT INTO users (email, password_hash, first_name, last_name, phone, role, status)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        ['farmer2@test.com', farmerPassword, 'Ama', 'Asante', '+233501234569', 'Farmer', 'Active']
      );
      console.log('✓ Farmer users created');

      // Create consumer user
      const consumerPassword = await AuthService.hashPassword('consumer123');
      await query(
        `INSERT INTO users (email, password_hash, first_name, last_name, phone, role, status)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        ['consumer@test.com', consumerPassword, 'Kofi', 'Owusu', '+233501234570', 'Consumer', 'Active']
      );
      console.log('✓ Consumer user created');

      // Get farmer IDs
      const farmer1 = await query('SELECT id FROM users WHERE email = ?', ['farmer1@test.com']);
      const farmer2 = await query('SELECT id FROM users WHERE email = ?', ['farmer2@test.com']);

      // Create sample products
      const products = [
        // Vegetables
        { farmer_id: farmer1.rows[0].id, name: 'Fresh Tomatoes', description: 'Organic red tomatoes, perfect for salads and cooking', category: 'Vegetables', price: 15.00, unit: 'kg', stock: 100 },
        { farmer_id: farmer1.rows[0].id, name: 'Garden Eggs', description: 'Fresh garden eggs (eggplant), locally grown', category: 'Vegetables', price: 12.00, unit: 'kg', stock: 50 },
        { farmer_id: farmer1.rows[0].id, name: 'Fresh Carrots', description: 'Crunchy orange carrots, rich in vitamins', category: 'Vegetables', price: 10.00, unit: 'kg', stock: 80 },
        { farmer_id: farmer2.rows[0].id, name: 'Fresh Onions', description: 'Quality onions for all your cooking needs', category: 'Vegetables', price: 8.00, unit: 'kg', stock: 120 },
        { farmer_id: farmer2.rows[0].id, name: 'Fresh Okra', description: 'Tender okra, perfect for soups and stews', category: 'Vegetables', price: 14.00, unit: 'kg', stock: 60 },
        
        // Fruits
        { farmer_id: farmer2.rows[0].id, name: 'Ripe Bananas', description: 'Sweet ripe bananas, naturally grown', category: 'Fruits', price: 10.00, unit: 'bunch', stock: 80 },
        { farmer_id: farmer2.rows[0].id, name: 'Fresh Pineapples', description: 'Juicy sweet pineapples from local farms', category: 'Fruits', price: 20.00, unit: 'piece', stock: 60 },
        { farmer_id: farmer1.rows[0].id, name: 'Watermelon', description: 'Large sweet watermelon, perfect for hot days', category: 'Fruits', price: 25.00, unit: 'piece', stock: 40 },
        { farmer_id: farmer1.rows[0].id, name: 'Fresh Avocado', description: 'Creamy avocados, rich in healthy fats', category: 'Fruits', price: 18.00, unit: 'kg', stock: 45 },
        { farmer_id: farmer2.rows[0].id, name: 'Ripe Mangoes', description: 'Sweet juicy mangoes, seasonal favorite', category: 'Fruits', price: 22.00, unit: 'kg', stock: 70 },
        
        // Grains
        { farmer_id: farmer1.rows[0].id, name: 'Sweet Corn', description: 'Fresh yellow corn, perfect for roasting', category: 'Grains', price: 8.00, unit: 'piece', stock: 200 },
        { farmer_id: farmer1.rows[0].id, name: 'Premium Rice', description: 'High-quality local rice, aromatic and fluffy', category: 'Grains', price: 35.00, unit: 'kg', stock: 150 },
        
        // Poultry
        { farmer_id: farmer1.rows[0].id, name: 'Free Range Eggs', description: 'Fresh farm eggs from free-range chickens', category: 'Poultry', price: 30.00, unit: 'crate', stock: 50 },
        { farmer_id: farmer1.rows[0].id, name: 'Whole Chicken', description: 'Fresh whole chicken, farm-raised', category: 'Poultry', price: 55.00, unit: 'piece', stock: 30 },
      ];

      for (const product of products) {
        await query(
          `INSERT INTO products (farmer_id, name, description, category, price, unit, stock_quantity, status)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [product.farmer_id, product.name, product.description, product.category, product.price, product.unit, product.stock, 'Active']
        );
      }
      console.log('✓ Sample products created');

      saveDatabase();
      console.log('✓ Database seeded successfully');
    } else {
      console.log('✓ Database already seeded');
    }
  } catch (error) {
    console.error('Seeding failed:', error);
  }
}

// Initialize database and start server
const startServer = async () => {
  try {
    // Run migrations to ensure schema is up to date
    await runMigrations();
    
    // Seed database
    await seedDatabase();

    app.listen(PORT, () => {
      console.log(`✓ Server running on port ${PORT}`);
      console.log(`✓ Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
