export type Supplier = {
  id: number;
  name: string;
  city: string;
};

export type InventoryItem = {
  id: number;
  supplier_id: number;
  product_name: string;
  quantity: number;
  price: number;
};

export type CreateSupplierInput = Omit<Supplier, 'id'>;
export type CreateInventoryInput = Omit<InventoryItem, 'id'>;

export type SupplierInventoryGroup = {
  supplier: Supplier;
  totalInventoryValue: number;
  inventory: InventoryItem[];
};
