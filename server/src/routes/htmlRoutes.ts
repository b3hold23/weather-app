import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Router } from 'express';

const rootDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

const router = Router();

// Serve index.html by default
router.get('/', (_req, res) => {
  res.sendFile(path.resolve(rootDir, 'client', 'index.html'));
});

export default router;