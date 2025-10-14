import jwt from "jsonwebtoken";
import crypto from "crypto";
import mongoose from "mongoose";
import { JWTService } from "../services/jwt.service";
import { UserModel } from "../models/User.model";
import { env } from "../config/env";

describe("JWTService - Integration Tests", () => {
    let testUserId: string;
    let testUser: any;

    beforeAll(async () => {
        // Connect to test database
        await mongoose.connect(env.MONGODB_URI);
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        // Clean up and create test user
        await UserModel.deleteMany({});

        testUser = await UserModel.create({
            name: "Test User",
            email: "test@example.com",
            password: "hashedpassword",
            isVerified: true,
            role: "user"
        });

        testUserId = testUser._id.toString();
    });

    afterEach(async () => {
        await UserModel.deleteMany({});
    });

    describe("createAccessToken", () => {
        it("should create a valid access token", () => {
            const token = JWTService.createAccessToken(testUserId);

            expect(typeof token).toBe("string");
            expect(token.length).toBeGreaterThan(0);

            // Verify the token can be decoded
            const decoded = JWTService.verifyAccessToken(token);
            expect(decoded.userId).toBe(testUserId);
        });
    });

    describe("createRefreshToken", () => {
        it("should create a valid refresh token", () => {
            const token = JWTService.createRefreshToken(testUserId);

            expect(typeof token).toBe("string");
            expect(token.length).toBeGreaterThan(0);

            // Verify the token can be decoded
            const decoded = JWTService.verifyRefreshToken(token);
            expect(decoded.userId).toBe(testUserId);
        });
    });

    describe("saveRefreshToken", () => {
        it("should save refresh token hash to user", async () => {
            const refreshToken = JWTService.createRefreshToken(testUserId);

            await JWTService.saveRefreshToken(testUserId, refreshToken);

            // Check if token was saved
            const updatedUser = await UserModel.findById(testUserId);
            expect(updatedUser?.refreshTokenHash).toBeDefined();
            expect(typeof updatedUser?.refreshTokenHash).toBe("string");
        });
    });

    describe("isValidRefreshToken", () => {
        it("should return true for valid token", async () => {
            const refreshToken = JWTService.createRefreshToken(testUserId);
            await JWTService.saveRefreshToken(testUserId, refreshToken);

            const isValid = await JWTService.isValidRefreshToken(testUserId, refreshToken);
            expect(isValid).toBe(true);
        });

        it("should return false for invalid token", async () => {
            const refreshToken = JWTService.createRefreshToken(testUserId);
            await JWTService.saveRefreshToken(testUserId, refreshToken);

            const isValid = await JWTService.isValidRefreshToken(testUserId, "invalid_token");
            expect(isValid).toBe(false);
        });

        it("should return false when no token is saved", async () => {
            const refreshToken = JWTService.createRefreshToken(testUserId);

            const isValid = await JWTService.isValidRefreshToken(testUserId, refreshToken);
            expect(isValid).toBe(false);
        });
    });

    describe("revokeRefreshToken", () => {
        it("should remove refresh token hash", async () => {
            const refreshToken = JWTService.createRefreshToken(testUserId);
            await JWTService.saveRefreshToken(testUserId, refreshToken);

            // Verify token exists
            let user = await UserModel.findById(testUserId);
            expect(user?.refreshTokenHash).toBeDefined();

            // Revoke token
            await JWTService.revokeRefreshToken(testUserId);

            // Verify token is removed
            user = await UserModel.findById(testUserId);
            expect(user?.refreshTokenHash).toBeNull();
        });
    });
});