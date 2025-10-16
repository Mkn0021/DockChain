import { ZodError } from "zod";
import APIError from "@api/errors";
import type { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

export const errorHandler = (
    err: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    const logMessage = err instanceof ZodError ? err.issues?.[0]?.message : err instanceof Error ? err.message : "Unknown error";
    console.error("API Error:", logMessage);

    if (err instanceof APIError) {
        const { statusCode, message, details } = err;
        return res.status(statusCode).json({ success: false, error: message, details });
    }

    if (err instanceof ZodError) {
        const message = err.issues?.[0]?.message ?? "Validation failed";
        return res.status(400).json({ success: false, error: message, details: err.issues });
    }

    if (err instanceof mongoose.Error) {
        const { statusCode, message } = (() => {
            if (err instanceof mongoose.Error.ValidationError) {
                return { statusCode: 400, message: "Validation failed for one or more fields" };
            }
            if (err instanceof mongoose.Error.CastError) {
                return {
                    statusCode: 400,
                    message: `Invalid ${err.path} value: ${err.value}`,
                };
            }
            if ((err as any).code === 11000) {
                return { statusCode: 409, message: "Duplicate entry violates unique constraint" };
            }
            return { statusCode: 500, message: "Database error" };
        })();

        return res.status(statusCode).json({ success: false, error: message, details: (err as any).message });
    }

    if (err instanceof SyntaxError && "body" in err) {
        return res.status(400).json({ success: false, error: "Malformed JSON in request body" });
    }

    const message = err instanceof Error ? err.message : "Unknown error";
    return res.status(500).json({ success: false, error: message });
};
