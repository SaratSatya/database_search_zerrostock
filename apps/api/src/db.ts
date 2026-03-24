import type {
  CreateInventoryInput,
  CreateSupplierInput,
  InventoryItem,
  Supplier,
  SupplierInventoryGroup,
} from './types.js';

// TODO for Codex:
// Replace this scaffold with a simple SQLite-backed implementation.
// Suggested minimal API surface to keep the rest of the app simple:
// - initDatabase()
// - resetDatabaseForTests()
// - createSupplier(input)
// - createInventory(input)
// - getInventoryGroupedBySupplier()

export async function initDatabase(): Promise<void> {
  // Intentionally left as a stub so the coding agent can choose a simple DB setup.
}

export async function resetDatabaseForTests(): Promise<void> {
  // Intentionally left as a stub.
}

export async function createSupplier(_input: CreateSupplierInput): Promise<Supplier> {
  throw new Error('Not implemented');
}

export async function createInventory(_input: CreateInventoryInput): Promise<InventoryItem> {
  throw new Error('Not implemented');
}

export async function getInventoryGroupedBySupplier(): Promise<SupplierInventoryGroup[]> {
  throw new Error('Not implemented');
}
