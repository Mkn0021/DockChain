import express from "express";
import { errorHandler } from "./api/middlewares/errorHandler";
import { securityMiddleware, rateLimiter, sanitizeInput } from "./api/middlewares/security";

const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(...securityMiddleware);
app.use(rateLimiter);
app.use(sanitizeInput);

// Example route
app.get("/", (_req, res) => res.json({ success: true, message: "API running" }));

app.use(errorHandler);

export default app;
