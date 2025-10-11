import { Request, Response, NextFunction } from "express";

// Prevent asyncHandler from attempting a real DB connection during tests.
// The mock must be registered before importing the module that uses it.
jest.mock("../config/database", () => ({
    connectDB: jest.fn(),
    isMongoConnected: jest.fn(() => true),
}));

import { asyncHandler } from "../api/response";

describe("asyncHandler", () => {
    const mockReq = {} as Request;
    const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    } as unknown as Response;
    const mockNext = jest.fn() as NextFunction;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should send success response when handler resolves", async () => {
        const handler = jest.fn().mockResolvedValue({
            data: { user: "ok" },
            message: "success"
        });

        await asyncHandler(handler)(
            mockReq as Request,
            mockRes as Response,
            mockNext as NextFunction
        );

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({
            success: true,
            data: { user: "ok" },
            message: "success"
        });
    });

    it("should call next on thrown error", async () => {
        const handler = async () => {
            throw new Error("handler failed");
        };

        await asyncHandler(handler)(mockReq, mockRes, mockNext);

        expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
});
