import initSqlJs, { Database as SqlJsDatabase } from 'sql.js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config();

const dbPath = process.env.DB_PATH || path.join(__dirname, '../../smart_farming.db');

let db: SqlJsDatabase;
let SQL: any;

// Initialize SQL.js
export async function initDatabase() {
  SQL = await initSqlJs();
  
  // Load existing database or create new one
  if (fs.existsSync(dbPath)) {
    const buffer = fs.readFileSync(dbPath);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }
  
  // Enable foreign keys
  db.run('PRAGMA foreign_keys = ON');
  
  return db;
}

// Save database to file
export function saveDatabase() {
  if (db) {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbPath, buffer);
  }
}

// Auto-save on exit
process.on('exit', () => saveDatabase());
process.on('SIGHUP', () => { saveDatabase(); process.exit(128 + 1); });
process.on('SIGINT', () => { saveDatabase(); process.exit(128 + 2); });
process.on('SIGTERM', () => { saveDatabase(); process.exit(128 + 15); });

// Helper function to mimic pg query interface
export const query = async (text: string, params?: any[]) => {
  if (!db) {
    await initDatabase();
  }
  
  try {
    // Convert PostgreSQL-style $1, $2 to SQLite-style ?
    const sqliteQuery = text.replace(/\$(\d+)/g, '?');
    
    if (text.trim().toUpperCase().startsWith('SELECT') || 
        text.trim().toUpperCase().startsWith('PRAGMA')) {
      const stmt = db.prepare(sqliteQuery);
      if (params && params.length > 0) {
        stmt.bind(params);
      }
      
      const rows: any[] = [];
      while (stmt.step()) {
        rows.push(stmt.getAsObject());
      }
      stmt.free();
      
      return { rows, rowCount: rows.length };
    } else {
      db.run(sqliteQuery, params || []);
      saveDatabase(); // Save after write operations
      
      return { 
        rows: [], 
        rowCount: db.getRowsModified(),
        lastID: undefined // sql.js doesn't provide lastInsertRowid easily
      };
    }
  } catch (error) {
    throw error;
  }
};

// Helper to get a "client" (for transaction compatibility)
export const getClient = async () => {
  if (!db) {
    await initDatabase();
  }
  return {
    query,
    release: () => {},
  };
};

export { db as pool }; // Alias for compatibility
export { db };
