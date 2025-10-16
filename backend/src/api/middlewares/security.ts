import cors from "cors";
import helmet from "helmet";
import { env } from "@config/env";
import rateLimit from "express-rate-limit";
import { Request, Response, NextFunction } from "express";

export const securityMiddleware = Object.freeze([
    helmet({
        contentSecurityPolicy: false,
        crossOriginEmbedderPolicy: false,
    }),
    cors({
        origin: env.ALLOWED_ORIGINS?.split(","),
        credentials: true,
    }),
]);

export const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, error: "Too many requests, please try again later." },
});

const sanitizeObject = (input: any): any => {
    if (typeof input === "string") {
        return input
            .replace(/<script.*?>.*?<\/script>/gi, "")
            .replace(/on\w+="[^"]*"/gi, "");
    }
    if (Array.isArray(input)) return input.map(sanitizeObject);
    if (input && typeof input === "object") {
        return Object.fromEntries(
            Object.entries(input).map(([k, v]) => [k, sanitizeObject(v)])
        );
    }
    return input;
};

const safeAssign = (obj: any, key: string, value: any) => {
    try {
        Object.defineProperty(obj, key, {
            value,
            writable: true,
            configurable: true,
        });
    } catch {
        Object.keys(value).forEach(k => (obj[key][k] = value[k]));
    }
};

export const sanitizeInput = (req: Request, _res: Response, next: NextFunction) => {
    if (req.body) req.body = sanitizeObject(req.body);
    if (req.query) safeAssign(req, "query", sanitizeObject(req.query) || {});
    if (req.params) safeAssign(req, "params", sanitizeObject(req.params) || {});
    next();
};

