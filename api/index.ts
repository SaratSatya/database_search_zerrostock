import { createApp } from '../apps/api/src/app.ts';
import { initDatabase } from '../apps/api/src/db.ts';

const app = createApp();

export default async function handler(req: unknown, res: unknown) {
  await initDatabase();
  return app(req as never, res as never);
}
