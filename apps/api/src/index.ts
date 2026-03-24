import { createApp } from './app.js';
import { initDatabase } from './db.js';

const port = Number(process.env.PORT || 4000);

async function bootstrap() {
  await initDatabase();
  const app = createApp();
  app.listen(port, () => {
    console.log(`API listening on http://localhost:${port}`);
  });
}

bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
