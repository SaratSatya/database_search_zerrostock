# Zeerostock Database Assignment Starter

Starter repository for the **Database-Focused Assignment** from the provided PDF.

This repo is intentionally scaffolded for an AI coding agent to finish quickly.

## What this repo already gives you

- Monorepo root with a single `api` app
- TypeScript API scaffold
- Route placeholders for the required endpoints
- Basic validation and response-shape placeholders
- Failing backend tests that define the expected behavior
- Agent guidance files that describe the exact acceptance criteria

## Assignment scope in this repo

Build a simple inventory database/API backend with:

- `POST /supplier`
- `POST /inventory`
- `GET /inventory`
- Suppliers and Inventory with a one-to-many relationship
- Validation rules:
  - inventory must belong to a valid supplier
  - quantity must be `>= 0`
  - price must be `> 0`
- grouped inventory response sorted by total inventory value (`quantity * price`)

## Suggested runtime shape

- API on `http://localhost:4000`
- simple SQLite-backed persistence is recommended, but not yet implemented in this scaffold

## Scripts

From the repo root:

- `npm install`
- `npm run dev`
- `npm run test`
- `npm run build`
