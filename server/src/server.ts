import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import open from 'open';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config();

// Import the routes
import routes from './routes/index.js';

const app = express();

const PORT = process.env.PORT || 3001;

// Serve static files of entire client dist folder
app.use(express.static(path.join(__dirname, './client/dist')));

// Implement middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Implement middleware to connect the routes
app.use('/api', routes);

// Serve index.html for any GET request
const rootDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
app.get('*', (_req, res) => {
  return res.sendFile(path.join(rootDir, '../client/dist/index.html'));
});
// Start the server on the port
app.listen(PORT, () => {
  console.log(`Listening on PORT: ${PORT}`);
  open(`http://localhost:${PORT}`);
});