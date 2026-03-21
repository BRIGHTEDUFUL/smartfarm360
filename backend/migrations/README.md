# Database Migrations

## SQLite Database

This project uses SQLite for local development. The database schema is managed through a single migration file.

### Running Migrations

```bash
npm run migrate
```

This creates `smart_farming.db` with all 13 tables:
- users
- farmer_profiles
- products
- product_images
- cart_items
- orders
- order_items
- reviews
- delivery_addresses
- payment_transactions
- wishlist_items
- refresh_tokens
- notifications
- inventory_history

### Database Location

- **File:** `backend/smart_farming.db`
- **Custom location:** Set `DB_PATH` in `.env`

### Schema Updates

To modify the schema, edit `src/config/migrate.ts` and re-run migrations.

**Note:** SQLite doesn't support ALTER TABLE for all operations. For major changes, you may need to:
1. Export data
2. Drop tables
3. Recreate with new schema
4. Import data
