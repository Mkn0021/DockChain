import { Response, NextFunction, Request, RequestHandler } from "express";
import { JWTService } from "../../services/jwt.service";
import APIError from "../errors";
import { AuthenticatedRequest } from "../../types/request.type";

export const validateAuth: RequestHandler = (
    req: Request,
    _res: Response,
    next: NextFunction
) => {
    const authenticatedReq = req as AuthenticatedRequest;
    try {
        const authHeader = authenticatedReq.headers.authorization;
        if (!authHeader?.startsWith("Bearer ")) {
            throw APIError.unauthorized("No token provided");
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            throw APIError.unauthorized("Invalid token format");
        }

        try {
            const decoded = JWTService.verifyAccessToken(token);
            authenticatedReq.user = {
                id: decoded.userId,
                email: decoded.email,
                role: decoded.role,
                isVerified: decoded.isVerified
            };
            next();
        } catch (error) {
            if (error instanceof Error) {
                throw APIError.unauthorized(
                    error.message === "jwt expired"
                        ? "Token expired"
                        : "Invalid token"
                );
            }
            throw error;
        }
    } catch (error) {
        next(error);
    }
};

export const validateAdmin: RequestHandler = (
    req: Request,
    _res: Response,
    next: NextFunction
) => {
    try {
        const authenticatedReq = req as AuthenticatedRequest;
        if (!authenticatedReq.user) {
            throw APIError.unauthorized("Authentication required");
        }

        if (authenticatedReq.user.role !== "admin") {
            throw APIError.forbidden("Admin access required");
        }

        next();
    } catch (error) {
        next(error);
    }
};

export const validateVerified: RequestHandler = (
    req: Request,
    _res: Response,
    next: NextFunction
) => {
    try {
        const authenticatedReq = req as AuthenticatedRequest;
        if (!authenticatedReq.user) {
            throw APIError.unauthorized("Authentication required");
        }

        if (!authenticatedReq.user.isVerified) {
            throw APIError.forbidden("Email verification required");
        }

        next();
    } catch (error) {
        next(error);
    }
};