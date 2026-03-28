import { initDatabase, query, saveDatabase } from '../config/database';
import { AuthService } from '../services/auth.service';

async function seed() {
  console.log('Seeding database...');

  await initDatabase();

  // Check if users already exist
  const existingAdmin = await query('SELECT id FROM users WHERE email = ?', ['admin@smartfarming.com']);
  
  if (existingAdmin.rows.length === 0) {
    // Create admin user
    const adminPassword = await AuthService.hashPassword('admin123');
    await query(
      `INSERT INTO users (email, password_hash, first_name, last_name, phone, role, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      ['admin@smartfarming.com', adminPassword, 'Admin', 'User', '+233501234567', 'Admin', 'Active']
    );
    console.log('✓ Admin user created (admin@smartfarming.com / admin123)');
  } else {
    console.log('✓ Admin user already exists');
  }

  // Check and create farmer users
  const existingFarmer1 = await query('SELECT id FROM users WHERE email = ?', ['farmer1@test.com']);
  if (existingFarmer1.rows.length === 0) {
    const farmerPassword = await AuthService.hashPassword('farmer123');
    await query(
      `INSERT INTO users (email, password_hash, first_name, last_name, phone, role, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      ['farmer1@test.com', farmerPassword, 'Kwame', 'Mensah', '+233501234568', 'Farmer', 'Active']
    );
    console.log('✓ Farmer 1 user created');
  } else {
    console.log('✓ Farmer 1 already exists');
  }

  const existingFarmer2 = await query('SELECT id FROM users WHERE email = ?', ['farmer2@test.com']);
  if (existingFarmer2.rows.length === 0) {
    const farmerPassword = await AuthService.hashPassword('farmer123');
    await query(
      `INSERT INTO users (email, password_hash, first_name, last_name, phone, role, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      ['farmer2@test.com', farmerPassword, 'Ama', 'Asante', '+233501234569', 'Farmer', 'Active']
    );
    console.log('✓ Farmer 2 user created');
  } else {
    console.log('✓ Farmer 2 already exists');
  }

  // Check and create consumer user
  const existingConsumer = await query('SELECT id FROM users WHERE email = ?', ['consumer@test.com']);
  if (existingConsumer.rows.length === 0) {
    const consumerPassword = await AuthService.hashPassword('consumer123');
    await query(
      `INSERT INTO users (email, password_hash, first_name, last_name, phone, role, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      ['consumer@test.com', consumerPassword, 'Kofi', 'Owusu', '+233501234570', 'Consumer', 'Active']
    );
    console.log('✓ Consumer user created (consumer@test.com / consumer123)');
  } else {
    console.log('✓ Consumer already exists');
  }
  // Get farmer IDs
  const farmer1 = await query('SELECT id FROM users WHERE email = ?', ['farmer1@test.com']);
  const farmer2 = await query('SELECT id FROM users WHERE email = ?', ['farmer2@test.com']);

  // Check if products already exist
  const existingProducts = await query('SELECT COUNT(*) as count FROM products');
  if (existingProducts.rows[0].count > 0) {
    console.log('✓ Products already exist, skipping product creation');
    saveDatabase();
    console.log('\n✓ Database seeded successfully!');
    console.log('\nTest Accounts:');
    console.log('  Admin: admin@smartfarming.com / admin123');
    console.log('  Farmer: farmer1@test.com / farmer123');
    console.log('  Consumer: consumer@test.com / consumer123');
    return;
  }

  // Create comprehensive product catalog
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
    
    // Grains & Cereals
    { farmer_id: farmer1.rows[0].id, name: 'Sweet Corn', description: 'Fresh yellow corn, perfect for roasting', category: 'Grains', price: 8.00, unit: 'piece', stock: 200 },
    { farmer_id: farmer1.rows[0].id, name: 'Premium Rice', description: 'High-quality local rice, aromatic and fluffy', category: 'Grains', price: 35.00, unit: 'kg', stock: 150 },
    { farmer_id: farmer2.rows[0].id, name: 'Brown Beans', description: 'Nutritious brown beans, protein-rich', category: 'Grains', price: 28.00, unit: 'kg', stock: 100 },
    { farmer_id: farmer2.rows[0].id, name: 'Pearl Millets', description: 'Healthy millet grains, gluten-free', category: 'Grains', price: 30.00, unit: 'kg', stock: 80 },
    
    // Tubers & Roots
    { farmer_id: farmer1.rows[0].id, name: 'Fresh Cassava', description: 'Quality cassava tubers, versatile staple', category: 'Grains', price: 12.00, unit: 'kg', stock: 120 },
    { farmer_id: farmer1.rows[0].id, name: 'White Yam', description: 'Premium white yam, perfect for pounding', category: 'Grains', price: 20.00, unit: 'kg', stock: 90 },
    { farmer_id: farmer2.rows[0].id, name: 'Cocoyam', description: 'Fresh cocoyam, traditional favorite', category: 'Grains', price: 15.00, unit: 'kg', stock: 70 },
    { farmer_id: farmer2.rows[0].id, name: 'Sweet Potatoes', description: 'Orange sweet potatoes, naturally sweet', category: 'Grains', price: 16.00, unit: 'kg', stock: 85 },
    
    // Poultry & Eggs
    { farmer_id: farmer1.rows[0].id, name: 'Free Range Eggs', description: 'Fresh farm eggs from free-range chickens', category: 'Poultry', price: 30.00, unit: 'crate', stock: 50 },
    { farmer_id: farmer1.rows[0].id, name: 'Whole Chicken', description: 'Fresh whole chicken, farm-raised', category: 'Poultry', price: 55.00, unit: 'piece', stock: 30 },
    { farmer_id: farmer2.rows[0].id, name: 'Duck Meat', description: 'Premium duck meat, tender and flavorful', category: 'Poultry', price: 65.00, unit: 'kg', stock: 20 },
    { farmer_id: farmer2.rows[0].id, name: 'Turkey', description: 'Large turkey, perfect for celebrations', category: 'Poultry', price: 120.00, unit: 'piece', stock: 15 },
    
    // Meat
    { farmer_id: farmer1.rows[0].id, name: 'Fresh Beef', description: 'Quality beef cuts, locally sourced', category: 'Meat', price: 80.00, unit: 'kg', stock: 40 },
    { farmer_id: farmer1.rows[0].id, name: 'Pork Meat', description: 'Fresh pork, tender and juicy', category: 'Meat', price: 70.00, unit: 'kg', stock: 35 },
    { farmer_id: farmer2.rows[0].id, name: 'Goat Meat', description: 'Premium goat meat, lean and healthy', category: 'Meat', price: 90.00, unit: 'kg', stock: 30 },
    { farmer_id: farmer2.rows[0].id, name: 'Fresh Fish', description: 'Fresh catch fish, rich in omega-3', category: 'Meat', price: 45.00, unit: 'kg', stock: 50 },
    { farmer_id: farmer1.rows[0].id, name: 'Snail Meat', description: 'Fresh snails, delicacy and nutritious', category: 'Meat', price: 55.00, unit: 'kg', stock: 25 },
    { farmer_id: farmer1.rows[0].id, name: 'Rabbit Meat', description: 'Tender rabbit meat, low in fat', category: 'Meat', price: 60.00, unit: 'kg', stock: 20 },
    
    // Dairy
    { farmer_id: farmer2.rows[0].id, name: 'Fresh Milk', description: 'Pure cow milk, pasteurized and fresh', category: 'Dairy', price: 18.00, unit: 'liter', stock: 60 },
    
    // Spices & Condiments
    { farmer_id: farmer1.rows[0].id, name: 'Hot Pepper', description: 'Spicy red peppers, adds heat to dishes', category: 'Spices', price: 20.00, unit: 'kg', stock: 40 },
    { farmer_id: farmer1.rows[0].id, name: 'Fresh Chilli', description: 'Hot chilli peppers, extremely spicy', category: 'Spices', price: 25.00, unit: 'kg', stock: 35 },
    { farmer_id: farmer2.rows[0].id, name: 'Fresh Ginger', description: 'Aromatic ginger root, medicinal properties', category: 'Spices', price: 22.00, unit: 'kg', stock: 50 },
    { farmer_id: farmer2.rows[0].id, name: 'Raw Honey', description: 'Pure natural honey from local bees', category: 'Spices', price: 45.00, unit: 'jar', stock: 40 },
    { farmer_id: farmer1.rows[0].id, name: 'Shito Pepper', description: 'Traditional Ghanaian hot pepper sauce', category: 'Spices', price: 35.00, unit: 'jar', stock: 60 },
    { farmer_id: farmer1.rows[0].id, name: 'Prekese Spice', description: 'Aromatic prekese for soups and stews', category: 'Spices', price: 15.00, unit: 'piece', stock: 80 },
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
  console.log('\n✓ Database seeded successfully!');
  console.log('\nTest Accounts:');
  console.log('  Admin: admin@smartfarming.com / admin123');
  console.log('  Farmer: farmer1@test.com / farmer123');
  console.log('  Consumer: consumer@test.com / consumer123');
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  });
