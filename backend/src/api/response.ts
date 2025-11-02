import APIError from "@api/errors";
import { Request, Response, NextFunction, CookieOptions } from "express";

export interface SuccessResponse<T> {
    success: true;
    data: T;
    message?: string;
}

export interface ErrorResponse {
    success: false;
    error: string;
}

export interface HandlerResult<T> {
    data?: T;
    message?: string;
    statusCode?: number;
    file?: { buffer: Buffer; fileName: string; contentType: string };
    cookies?: { name: string; value: string; options?: CookieOptions }[];
    headers?: Record<string, string>;
}

export const apiResponse = {
    success: <T>(
        res: Response,
        data: T,
        message?: string,
        statusCode = 200,
        options?: { 
            file?: { buffer: Buffer; fileName: string; contentType: string };
            cookies?: { name: string; value: string; options?: CookieOptions }[];
            headers?: Record<string, string>;
        }
    ): Response<any> => {
        if (options?.headers) {
            Object.entries(options.headers).forEach(([key, value]) => {
                res.setHeader(key, value);
            });
        }

        if (options?.cookies) {
            options.cookies.forEach(cookie => {
                res.cookie(cookie.name, cookie.value, cookie.options || {});
            });
        }
        
        if (options?.file) {
            const { buffer, fileName, contentType } = options.file;
            res.setHeader('Content-Type', contentType);
            res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
            return res.status(statusCode).send(buffer);
        }
        
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
    handler: (req: Request) => Promise<HandlerResult<T>>
) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await handler(req);
            
            return apiResponse.success(
                res, 
                result.data ?? null, 
                result.message, 
                result.statusCode || 200, 
                {
                    ...(result.file ? { file: result.file } : {}),
                    ...(result.cookies ? { cookies: result.cookies } : {}),
                    ...(result.headers ? { headers: result.headers } : {})
                }
            );
        } catch (error) {
            next(error);
        }
    };
};