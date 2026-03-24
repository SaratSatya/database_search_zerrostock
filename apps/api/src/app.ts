import express from 'express';
import cors from 'cors';
import { z } from 'zod';
import {
  createInventory,
  createSupplier,
  getInventoryGroupedBySupplier,
} from './db.js';

const supplierSchema = z.object({
  name: z.string().trim().min(1, 'name is required'),
  city: z.string().trim().min(1, 'city is required'),
});

const inventorySchema = z.object({
  supplier_id: z.number().int().positive(),
  product_name: z.string().trim().min(1, 'product_name is required'),
  quantity: z.number().int().min(0),
  price: z.number().positive(),
});

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());


  app.get('/', (_req, res) => {
    res.json({
      ok: true,
      assignment: 'B',
      endpoints: ['GET /health', 'POST /supplier', 'POST /inventory', 'GET /inventory'],
    });
  });

  app.get('/health', (_req, res) => {
    res.json({ ok: true, assignment: 'B' });
  });

  app.post('/supplier', async (req, res) => {
    const parsed = supplierSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: 'Invalid supplier payload',
        details: parsed.error.flatten(),
      });
    }

    try {
      const supplier = await createSupplier(parsed.data);
      return res.status(201).json(supplier);
    } catch (error) {
      return res.status(501).json({
        error: error instanceof Error ? error.message : 'Not implemented',
      });
    }
  });

  app.post('/inventory', async (req, res) => {
    const parsed = inventorySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: 'Invalid inventory payload',
        details: parsed.error.flatten(),
      });
    }

    try {
      const inventory = await createInventory(parsed.data);
      return res.status(201).json(inventory);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Not implemented';
      const status = message.toLowerCase().includes('supplier') ? 400 : 501;
      return res.status(status).json({ error: message });
    }
  });

  app.get('/inventory', async (_req, res) => {
    try {
      const grouped = await getInventoryGroupedBySupplier();
      return res.json({ data: grouped });
    } catch (error) {
      return res.status(501).json({
        error: error instanceof Error ? error.message : 'Not implemented',
      });
    }
  });

  return app;
}
