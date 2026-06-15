import dotenv from 'dotenv';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import app from './app.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '../.env') });

const port = Number(process.env.PORT || 4000);

app.listen(port, () => {
  console.log(`Suduq API listening on http://localhost:${port}`);
});
