import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import type {
  CreateInventoryInput,
  CreateSupplierInput,
  InventoryItem,
  Supplier,
  SupplierInventoryGroup,
} from './types.js';

const defaultDbPath = fileURLToPath(new URL('../data/inventory.db', import.meta.url));
const testDbPath = fileURLToPath(new URL('../data/inventory.test.db', import.meta.url));

const require = createRequire(import.meta.url);
const { DatabaseSync } = require('node:sqlite') as { DatabaseSync: new (path: string) => DatabaseSync };

type DatabaseSync = {
  exec: (sql: string) => void;
  prepare: (sql: string) => {
    run: (...params: unknown[]) => { lastInsertRowid?: number | bigint };
    get: (...params: unknown[]) => unknown;
    all: (...params: unknown[]) => unknown[];
  };
};

let db: DatabaseSync | null = null;

function getDatabasePath() {
  if (process.env.DB_PATH) {
    return path.resolve(process.env.DB_PATH);
  }

  return process.env.NODE_ENV === 'test' ? testDbPath : defaultDbPath;
}

function ensureDatabase() {
  if (db) {
    return db;
  }

  const dbPath = getDatabasePath();
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });

  db = new DatabaseSync(dbPath);
  db.exec('PRAGMA foreign_keys = ON;');

  db.exec(`
    CREATE TABLE IF NOT EXISTS suppliers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      city TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS inventory (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      supplier_id INTEGER NOT NULL,
      product_name TEXT NOT NULL,
      quantity INTEGER NOT NULL CHECK(quantity >= 0),
      price REAL NOT NULL CHECK(price > 0),
      FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
    );
  `);

  return db;
}

export async function initDatabase(): Promise<void> {
  ensureDatabase();
}

export async function resetDatabaseForTests(): Promise<void> {
  const conn = ensureDatabase();
  conn.exec('DELETE FROM inventory; DELETE FROM suppliers;');
}

export async function createSupplier(input: CreateSupplierInput): Promise<Supplier> {
  const conn = ensureDatabase();
  const statement = conn.prepare('INSERT INTO suppliers (name, city) VALUES (?, ?)');
  const result = statement.run(input.name, input.city);

  return {
    id: Number(result.lastInsertRowid),
    name: input.name,
    city: input.city,
  };
}

export async function createInventory(input: CreateInventoryInput): Promise<InventoryItem> {
  const conn = ensureDatabase();

  const supplier = conn
    .prepare('SELECT id FROM suppliers WHERE id = ?')
    .get(input.supplier_id) as { id: number } | undefined;

  if (!supplier) {
    throw new Error('Supplier does not exist');
  }

  const statement = conn.prepare(
    'INSERT INTO inventory (supplier_id, product_name, quantity, price) VALUES (?, ?, ?, ?)',
  );

  const result = statement.run(
    input.supplier_id,
    input.product_name,
    input.quantity,
    input.price,
  );

  return {
    id: Number(result.lastInsertRowid),
    supplier_id: input.supplier_id,
    product_name: input.product_name,
    quantity: input.quantity,
    price: input.price,
  };
}

export async function getInventoryGroupedBySupplier(): Promise<SupplierInventoryGroup[]> {
  const conn = ensureDatabase();

  const suppliers = conn
    .prepare(
      `
      SELECT
        s.id,
        s.name,
        s.city,
        COALESCE(SUM(i.quantity * i.price), 0) AS totalInventoryValue
      FROM suppliers s
      LEFT JOIN inventory i ON i.supplier_id = s.id
      GROUP BY s.id
      ORDER BY totalInventoryValue DESC, s.id ASC
      `,
    )
    .all() as Array<{
    id: number;
    name: string;
    city: string;
    totalInventoryValue: number;
  }>;

  const inventoryBySupplier = conn.prepare(
    'SELECT id, supplier_id, product_name, quantity, price FROM inventory WHERE supplier_id = ? ORDER BY id ASC',
  );

  return suppliers.map((supplier) => ({
    supplier: {
      id: supplier.id,
      name: supplier.name,
      city: supplier.city,
    },
    totalInventoryValue: Number(supplier.totalInventoryValue),
    items: inventoryBySupplier.all(supplier.id) as InventoryItem[],
  }));
}
