# Zeerostock Database Assignment (Assignment B)

This repository now implements **Assignment B: Inventory Database + APIs** using a real SQLite database.

## Why SQLite was chosen

SQLite was chosen because it matches the assignment goals:
- real SQL database behavior (relations, constraints, aggregation)
- zero external service setup for local runs
- fast and deterministic for tests
- simple file-backed persistence

## API scope implemented

- `POST /supplier`
- `POST /inventory`
- `GET /inventory`

Business rules enforced:
- inventory must reference a valid supplier
- `quantity >= 0`
- `price > 0`

## Database connection setup

The backend uses Node's built-in `node:sqlite` module with a file-backed SQLite database.

- default runtime DB file: `apps/api/data/inventory.db`
- test DB file (when `NODE_ENV=test`): `apps/api/data/inventory.test.db`
- optional override via `DB_PATH`

On startup (or first DB access), schema creation runs automatically with `CREATE TABLE IF NOT EXISTS`.

## Schema

### `suppliers`
- `id` INTEGER PRIMARY KEY AUTOINCREMENT
- `name` TEXT NOT NULL
- `city` TEXT NOT NULL

### `inventory`
- `id` INTEGER PRIMARY KEY AUTOINCREMENT
- `supplier_id` INTEGER NOT NULL (FK → `suppliers.id`)
- `product_name` TEXT NOT NULL
- `quantity` INTEGER NOT NULL CHECK (`quantity >= 0`)
- `price` REAL NOT NULL CHECK (`price > 0`)

Relationship: one supplier has many inventory items.

## GET /inventory behavior

`GET /inventory` returns supplier-grouped results, including:
- supplier details
- all inventory items for that supplier
- computed `totalInventoryValue = SUM(quantity * price)`

Supplier groups are sorted by `totalInventoryValue` descending.

## How to run

From repo root:

```bash
npm install
npm run dev
```

API runs on `http://localhost:4000`.

## How to run tests

From repo root:

```bash
npm run test
```

## Build

From repo root:

```bash
npm run build
```

## One indexing / optimization suggestion

Add an index on inventory supplier lookups:

```sql
CREATE INDEX idx_inventory_supplier_id ON inventory(supplier_id);
```

This improves supplier-grouping and item-fetch queries as data volume grows.
