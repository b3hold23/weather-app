import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Router } from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.dirname(__dirname); 

const router = Router();

// Serve index.html by default
router.get('/', (req, res) => {
  res.sendFile(path.resolve(rootDir, 'client', 'index.html'));
});

export default router;