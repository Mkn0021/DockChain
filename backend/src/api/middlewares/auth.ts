import { Response, NextFunction, Request, RequestHandler } from "express";
import { JWTService } from "@services/jwt.service";
import APIError from "@api/errors";
import { AuthenticatedRequest } from "@type/request.type";

const validateAuth: RequestHandler = (
    req: Request,
    _res: Response,
    next: NextFunction
) => {
    const authenticatedReq = req as AuthenticatedRequest;
    try {
        const user = getDecodedUser(req);
        authenticatedReq.user = user;

        if (!authenticatedReq.user.isVerified) {
            throw APIError.forbidden("Email verification required");
        }

        next();
    } catch (error) {
        next(error);
    }
};

export const validateAdmin: RequestHandler = (
    req: Request,
    _res: Response,
    next: NextFunction
) => {
    const authenticatedReq = req as AuthenticatedRequest;
    try {
        const user = getDecodedUser(req);
        authenticatedReq.user = user;

        if (authenticatedReq.user.role !== "admin") {
            throw APIError.forbidden("Admin access required");
        }

        next();
    } catch (error) {
        next(error);
    }
};

const getDecodedUser = (req: Request) => {
    const token = req.cookies?.access_token ||
        (req.headers.authorization?.startsWith("Bearer ")
            ? req.headers.authorization.split(" ")[1]
            : null);

    if (!token) {
        throw APIError.unauthorized("No token provided");
    }

    const decoded = JWTService.verifyAccessToken(token);

    return {
        id: decoded.userId,
        email: decoded.email,
        role: decoded.role,
        isVerified: decoded.isVerified
    };
};

export default validateAuth;