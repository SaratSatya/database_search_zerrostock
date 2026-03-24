import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { createApp } from './app.js';
import { resetDatabaseForTests } from './db.js';

const app = createApp();

describe('database-focused assignment API', () => {
  beforeEach(async () => {
    await resetDatabaseForTests();
  });


  it('returns API info at root path', async () => {
    const response = await request(app).get('/');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      ok: true,
      assignment: 'B',
    });
    expect(response.body.endpoints).toContain('POST /supplier');
  });

  it('creates a supplier', async () => {
    const response = await request(app).post('/supplier').send({
      name: 'Acme Surplus',
      city: 'Mumbai',
    });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      id: expect.any(Number),
      name: 'Acme Surplus',
      city: 'Mumbai',
    });
  });

  it('creates inventory for a valid supplier', async () => {
    const supplier = await request(app).post('/supplier').send({
      name: 'North Supply',
      city: 'Delhi',
    });

    const response = await request(app).post('/inventory').send({
      supplier_id: supplier.body.id,
      product_name: 'Steel Rods',
      quantity: 5,
      price: 20,
    });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      id: expect.any(Number),
      supplier_id: supplier.body.id,
      product_name: 'Steel Rods',
      quantity: 5,
      price: 20,
    });
  });

  it('rejects inventory for an invalid supplier', async () => {
    const response = await request(app).post('/inventory').send({
      supplier_id: 9999,
      product_name: 'Ghost Stock',
      quantity: 1,
      price: 10,
    });

    expect(response.status).toBe(400);
  });

  it('rejects negative quantity', async () => {
    const supplier = await request(app).post('/supplier').send({
      name: 'West Trade',
      city: 'Pune',
    });

    const response = await request(app).post('/inventory').send({
      supplier_id: supplier.body.id,
      product_name: 'Copper Wire',
      quantity: -1,
      price: 15,
    });

    expect(response.status).toBe(400);
  });

  it('rejects non-positive price', async () => {
    const supplier = await request(app).post('/supplier').send({
      name: 'East Trade',
      city: 'Bengaluru',
    });

    const response = await request(app).post('/inventory').send({
      supplier_id: supplier.body.id,
      product_name: 'Plastic Sheets',
      quantity: 10,
      price: 0,
    });

    expect(response.status).toBe(400);
  });

  it('returns grouped inventory sorted by total inventory value descending', async () => {
    const supplierA = await request(app).post('/supplier').send({
      name: 'Alpha Supply',
      city: 'Jaipur',
    });
    const supplierB = await request(app).post('/supplier').send({
      name: 'Beta Supply',
      city: 'Chennai',
    });

    await request(app).post('/inventory').send({
      supplier_id: supplierA.body.id,
      product_name: 'Motors',
      quantity: 2,
      price: 100,
    });
    await request(app).post('/inventory').send({
      supplier_id: supplierA.body.id,
      product_name: 'Bolts',
      quantity: 10,
      price: 5,
    });
    await request(app).post('/inventory').send({
      supplier_id: supplierB.body.id,
      product_name: 'Panels',
      quantity: 3,
      price: 120,
    });

    const response = await request(app).get('/inventory');

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(2);
    expect(response.body.data[0]).toMatchObject({
      supplier: {
        id: supplierB.body.id,
        name: 'Beta Supply',
        city: 'Chennai',
      },
      totalInventoryValue: 360,
    });
    expect(response.body.data[1]).toMatchObject({
      supplier: {
        id: supplierA.body.id,
        name: 'Alpha Supply',
        city: 'Jaipur',
      },
      totalInventoryValue: 250,
    });
    expect(response.body.data[0].items).toEqual([
      expect.objectContaining({ product_name: 'Panels' }),
    ]);
  });
});
