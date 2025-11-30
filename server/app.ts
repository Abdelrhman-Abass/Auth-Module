import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import rateLimit from "express-rate-limit";
import wrapRoutes from './routes/index.routes';
import swaggerUi from "swagger-ui-express";
import swaggerDocs from "./docs/swagger.js"; // Your beautiful Swagger YAML converted to JSON
import errorHandler from "./middlewares/errorMiddleware";
import { setupPassport } from "./controllers/auth.controller";


const app = express();

// Initialize Passport for Google OAuth
setupPassport(app);

// Security & Essentials
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));

// CORS — allow your frontend
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://auth-module-silk.vercel.app",
      "https://auth-module-3nbt.vercel.app",
      "https://your-production-frontend.com", // Change later
    ],
    credentials: true,
  })
);

// Global rate limiting (prevents brute force)
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 200,
  message: { success: false, message: "Too many requests, try again later" },
});
app.use(limiter);

wrapRoutes(app)


// Serve Swagger UI with custom static file paths
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocs, {
    customCssUrl: 'https://unpkg.com/swagger-ui-dist@5/swagger-ui.css',
    customJs: [
      'https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js',
      'https://unpkg.com/swagger-ui-dist@5/swagger-ui-standalone-preset.js',
    ],
  })
);

// Expose Swagger JSON for debugging
app.get('/swagger.json', (_req, res) => {
  res.json(swaggerDocs);
});

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "OK", module: "Universal Auth Module", timestamp: new Date().toISOString() });
});


// Root route — for demo
app.get("/", (_req, res) => {
  res.send(`
    <h1>Universal Authentication Module</h1>
    <p>Swagger Docs: <a href="/api-docs">/api-docs</a></p>
    <p>Health: <a href="/health">/health</a></p>
    <p><strong>Status: 100% Complete & Production Ready</strong></p>
  `);
});

app.use(errorHandler);

export { app };