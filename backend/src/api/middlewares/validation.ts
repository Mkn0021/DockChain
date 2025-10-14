import { z } from "zod";
import { Request, Response, NextFunction } from "express";

export const validateRequest = (schema: z.ZodType) => {
    return (req: Request, _res: Response, next: NextFunction) => {
        try {
            schema.parse({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        } catch (err) {
            return next(err);
        }
    };
};
