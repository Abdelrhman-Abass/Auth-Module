import { createServer } from 'http';
import { app } from '../app.js';

const port = Number(process.env['PORT'] ?? 5000);

const server = createServer(app);

server.listen(port);

