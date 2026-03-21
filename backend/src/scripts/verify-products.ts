import { initDatabase, query } from '../config/database';

async function verifyProducts() {
  await initDatabase();

  const countResult = await query('SELECT COUNT(*) as count FROM products', []);
  const count = countResult.rows[0].count;
  console.log('\n✓ Total products in database:', count);

  const productsResult = await query('SELECT id, name, category FROM products ORDER BY category, name', []);
  const products = productsResult.rows;

  const byCategory: { [key: string]: string[] } = {};
  products.forEach((p: any) => {
    if (!byCategory[p.category]) byCategory[p.category] = [];
    byCategory[p.category].push(p.name);
  });

  console.log('\n📦 Products by Category:\n');
  Object.keys(byCategory).sort().forEach(category => {
    console.log(`${category} (${byCategory[category].length}):`);
    byCategory[category].forEach(name => console.log(`  • ${name}`));
    console.log('');
  });

  process.exit(0);
}

verifyProducts().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
