import APIError from "./errors";
import { Request, Response, NextFunction } from "express";
import { connectDB, isMongoConnected } from "../config/database";

export interface SuccessResponse<T> {
    success: true;
    data: T;
    message?: string;
}

export interface ErrorResponse {
    success: false;
    error: string;
}

export const apiResponse = {
    success: <T>(
        res: Response,
        data: T,
        message?: string,
        statusCode = 200
    ): Response<SuccessResponse<T>> => {
        return res.status(statusCode).json({ success: true, data, message });
    },

    error: (
        res: Response,
        error: string | APIError | Error,
        statusCode = 500
    ): Response<ErrorResponse> => {
        const message = error instanceof Error ? error.message : error;
        const code = error instanceof APIError ? error.statusCode : statusCode;
        return res.status(code).json({ success: false, error: message });
    },
};

export const asyncHandler = <T>(
    handler: (req: Request) => Promise<{ data: T; message?: string }>
) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            connectDB();

            if (!isMongoConnected()) {
                throw APIError.internal('Database connection error');
            }

            const result = await handler(req);
            return apiResponse.success(res, result.data, result.message);
        } catch (error) {
            next(error);
        }
    };
};
