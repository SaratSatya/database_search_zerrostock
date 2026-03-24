# Agent Instructions

You are completing the **Database-Focused Assignment**.

## Goal

Finish this repository so it satisfies the assignment exactly, with clean code and minimal overengineering.

## Functional requirements

### Database / data model
Create two tables or collections:

- `suppliers`
  - `id`
  - `name`
  - `city`
- `inventory`
  - `id`
  - `supplier_id`
  - `product_name`
  - `quantity`
  - `price`

Relationship:
- one supplier has many inventory items

### Backend APIs
Implement:
- `POST /supplier`
- `POST /inventory`
- `GET /inventory`

Rules:
- inventory must belong to a valid supplier
- quantity must be `>= 0`
- price must be `> 0`

### Required query behavior
`GET /inventory` must:
- return all inventory grouped by supplier
- include each supplier's inventory items
- include a computed `totalInventoryValue`
- sort suppliers by `totalInventoryValue` descending

## Non-functional goals

- keep the implementation simple
- avoid auth and Docker
- avoid unnecessary architecture
- prefer SQLite or another simple local SQL option
- keep TypeScript clean
- use the existing folder structure

## Deliverables expected in repo

- working storage layer
- working API
- tests covering validations and grouped/sorted query behavior
- short README update with:
  - database schema explanation
  - why SQL or NoSQL was chosen
  - one indexing or optimization suggestion

## Priority order

1. Make API behavior correct
2. Keep the storage layer simple and reliable
3. Make tests pass
4. Polish README
