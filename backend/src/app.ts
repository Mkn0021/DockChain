import express from "express";
import { errorHandler } from "@middlewares/errorHandler";
import { securityMiddleware, rateLimiter, sanitizeInput } from "@middlewares/security";
import routes from "./api/routes";

const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(...securityMiddleware);
app.use(rateLimiter);
app.use(sanitizeInput);

// API routes
app.use("/api", routes);

// Health check route
app.get("/", (_req, res) => res.json({ success: true, message: "API running" }));

app.use(errorHandler);

export default app;
