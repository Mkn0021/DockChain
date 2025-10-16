import { Request, Response } from "express";
import { ZodError } from "zod";
import APIError from "@api/errors";
import { errorHandler } from "@middlewares/errorHandler";

describe("errorHandler", () => {
    const mockReq = {} as Request;
    const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    } as unknown as Response;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should handle ApiError", () => {
        const error = new APIError("Custom API failure", 400);

        errorHandler(error, mockReq, mockRes, jest.fn());

        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({
            success: false,
            error: "Custom API failure",
            details: undefined
        });
    });

    it("should handle ZodError", () => {
        const zodError = new ZodError([
            { path: ["name"], message: "Invalid name", code: "custom" }
        ]);

        errorHandler(zodError, mockReq, mockRes, jest.fn());

        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({
            success: false,
            error: "Invalid name",
            details: zodError.issues
        });
    });

    it("should handle generic Error", () => {
        const error = new Error("Something broke");

        errorHandler(error, mockReq, mockRes, jest.fn());

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({
            success: false,
            error: "Something broke"
        });
    });
});
