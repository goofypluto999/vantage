import { createServer } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.chdir(__dirname);

const server = await createServer({
  root: __dirname,
  configFile: path.join(__dirname, 'vite.config.ts'),
  server: {
    port: 3000,
    host: '0.0.0.0',
    strictPort: true,
  },
});

await server.listen();
server.printUrls();
