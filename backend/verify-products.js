const Database = require('better-sqlite3');
const db = new Database('./smart_farming.db');

const count = db.prepare('SELECT COUNT(*) as count FROM products').get();
console.log('\n✓ Total products in database:', count.count);

const products = db.prepare('SELECT id, name, category FROM products ORDER BY category, name').all();

const byCategory = {};
products.forEach(p => {
  if (!byCategory[p.category]) byCategory[p.category] = [];
  byCategory[p.category].push(p.name);
});

console.log('\n📦 Products by Category:\n');
Object.keys(byCategory).sort().forEach(category => {
  console.log(`${category} (${byCategory[category].length}):`);
  byCategory[category].forEach(name => console.log(`  • ${name}`));
  console.log('');
});

db.close();
