import { defineConfig, env } from 'prisma/config';

const directUrl = process.env['DIRECT_URL'];

export default defineConfig({
  engine: 'classic',
  datasource: {
    url: env('DATABASE_URL'),
    ...(directUrl ? { directUrl: env('DIRECT_URL') } : {}),
  },
});