import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = process.env.PORT || 3000;
const binPath = path.join(__dirname, 'node_modules', 'json-server', 'lib', 'bin.js');

console.log(`Iniciando JSON Server en el puerto ${port}...`);

const child = spawn('node', [binPath, 'db/db.json', '--port', port], {
  stdio: 'inherit'
});

child.on('close', (code) => {
  process.exit(code);
});
