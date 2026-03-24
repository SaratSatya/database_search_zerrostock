# Zeerostock Database Assignment (Assignment B)

This repository implements **Assignment B: Inventory Database + APIs** using a real SQLite database.

## Why SQLite was chosen

SQLite was chosen because it fits the assignment goals:
- real SQL behavior (relations, constraints, aggregations)
- no external database service required for local setup
- deterministic and quick test execution
- simple file-backed persistence

## API scope implemented

- `POST /supplier`
- `POST /inventory`
- `GET /inventory`

Utility endpoints:
- `GET /`
- `GET /health`

Business rules enforced:
- inventory must reference a valid supplier
- `quantity >= 0`
- `price > 0`

## Database connection setup

The backend uses Node's built-in `node:sqlite` module with file-backed SQLite.

- default runtime DB file: `apps/api/data/inventory.db`
- test DB file (when `NODE_ENV=test`): `apps/api/data/inventory.test.db`
- optional override via `DB_PATH`

On startup (or first DB access), schema creation runs automatically using `CREATE TABLE IF NOT EXISTS`.

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

`GET /inventory` returns supplier-grouped results with:
- supplier details
- that supplier's inventory items
- computed `totalInventoryValue = SUM(quantity * price)`

Supplier groups are sorted by `totalInventoryValue` descending.

## How to run

From repo root:

```bash
npm install
npm run dev
```

API runs on `http://localhost:4000`.

## API testing with Postman or cURL

Base URL:

```text
http://localhost:4000
```

### 1) Create supplier

**POST** `/supplier`

Body:

```json
{
  "name": "ABC Traders",
  "city": "Hyderabad"
}
```

Example cURL:

```bash
curl -X POST http://localhost:4000/supplier \
  -H "Content-Type: application/json" \
  -d '{"name":"ABC Traders","city":"Hyderabad"}'
```

### 2) Create inventory

**POST** `/inventory`

Body (use the `id` returned by supplier create):

```json
{
  "supplier_id": 1,
  "product_name": "Rice",
  "quantity": 20,
  "price": 50
}
```

Example cURL:

```bash
curl -X POST http://localhost:4000/inventory \
  -H "Content-Type: application/json" \
  -d '{"supplier_id":1,"product_name":"Rice","quantity":20,"price":50}'
```

### 3) Get grouped inventory

**GET** `/inventory`

Example cURL:

```bash
curl http://localhost:4000/inventory
```

Sample response:

```json
{
  "data": [
    {
      "supplier": {
        "id": 1,
        "name": "ABC Traders",
        "city": "Hyderabad"
      },
      "totalInventoryValue": 1000,
      "items": [
        {
          "id": 1,
          "supplier_id": 1,
          "product_name": "Rice",
          "quantity": 20,
          "price": 50
        }
      ]
    }
  ]
}
```

Notes:
- If you call `GET /inventory` before inserts, you will get `{ "data": [] }`.
- Browser address bars only send GET requests, so use Postman/cURL for `POST` endpoints.

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

Add an index for supplier lookups on inventory:

```sql
CREATE INDEX idx_inventory_supplier_id ON inventory(supplier_id);
```

This improves grouping and supplier-item fetch performance as data grows.
