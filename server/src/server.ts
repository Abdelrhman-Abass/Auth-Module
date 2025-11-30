import { createServer } from 'http';
import { app } from '../app.js';

const port = Number(process.env['PORT'] ?? 5000);

const server = createServer(app);

server.listen(port, () => {
  const env = process.env['NODE_ENV'] ?? 'development';
  console.log(`🚀 Server running on port ${port}`);
  console.log(`🌍 Environment: ${env}`);
});

