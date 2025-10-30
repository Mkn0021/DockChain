import crypto from "crypto";
import jwt from "jsonwebtoken";
import { env } from "@config/env";
import { CookieOptions } from "express";
import UserModel from "@model/User.model";
import { JWTPayload } from "@type/request.type";
import { GenerateCookies } from "@type/auth.type";

export class JWTService {
    private static readonly ACCESS_EXPIRY = "15m";
    private static readonly REFRESH_EXPIRY = "7d";
    private static readonly DEFAULT_COOKIE_OPTIONS: CookieOptions = {
        httpOnly: true,
        secure: false, // Set to true if using HTTPS
    };

    private static createPayload(userId: string, additionalData?: Record<string, any>) {
        return {
            userId,
            ...(additionalData || {}),
            iat: Math.floor(Date.now() / 1000)
        };
    }

    // Create short-lived access token (15 minutes)
    static createAccessToken(userId: string, additionalData?: Record<string, any>): string {
        const payload = this.createPayload(userId, additionalData);
        return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
            expiresIn: this.ACCESS_EXPIRY
        });
    }

    // Create long-lived refresh token (7 days)
    static createRefreshToken(userId: string, additionalData?: Record<string, any>): string {
        const payload = this.createPayload(userId, additionalData);
        return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
            expiresIn: this.REFRESH_EXPIRY
        });
    }

    // Generate both tokens and save refresh token in one operation
    static async generateAuthTokens(userId: string, additionalData?: Record<string, any>): Promise<{
        accessToken: string;
        refreshToken: string;
    }> {
        const payload = this.createPayload(userId, additionalData);
        const accessToken = jwt.sign(payload, env.JWT_ACCESS_SECRET, {
            expiresIn: this.ACCESS_EXPIRY
        });
        const refreshToken = jwt.sign(payload, env.JWT_REFRESH_SECRET, {
            expiresIn: this.REFRESH_EXPIRY
        });

        await this.saveRefreshToken(userId, refreshToken);

        return {
            accessToken,
            refreshToken
        };
    }

    // Prepare cookies for tokens
    static generateCookies(data: GenerateCookies) {
        const { accessToken, refreshToken, customOptions } = data;

        const accessTokenOptions: CookieOptions = {
            ...this.DEFAULT_COOKIE_OPTIONS,
            maxAge: 15 * 60 * 1000, // 15 minutes
            ...customOptions?.accessTokenOptions
        };

        const refreshTokenOptions: CookieOptions = {
            ...this.DEFAULT_COOKIE_OPTIONS,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            ...customOptions?.refreshTokenOptions
        };

        return [
            { name: 'access_token', value: accessToken, options: accessTokenOptions },
            { name: 'refresh_token', value: refreshToken, options: refreshTokenOptions }
        ];
    }

    // Clear token cookies
    static clearCookies() {
        const clearOptions: CookieOptions = {
            ...this.DEFAULT_COOKIE_OPTIONS,
            maxAge: 0
        };

        return [
            { name: 'access_token', value: '', options: clearOptions },
            { name: 'refresh_token', value: '', options: clearOptions }
        ];
    }

    static refreshCookie(accessToken: string, options?: CookieOptions) {
        const cookieOptions: CookieOptions = {
            ...this.DEFAULT_COOKIE_OPTIONS,
            maxAge: 15 * 60 * 1000, // 15 minutes
            ...options
        };

        return { name: 'access_token', value: accessToken, options: cookieOptions };
    }

    // Verify access token
    static verifyAccessToken(token: string): JWTPayload {
        return jwt.verify(token, env.JWT_ACCESS_SECRET) as JWTPayload;
    }

    // Verify refresh token
    static verifyRefreshToken(token: string): JWTPayload {
        return jwt.verify(token, env.JWT_REFRESH_SECRET) as JWTPayload;
    }

    // Save refresh token hash to database
    static async saveRefreshToken(userId: string, token: string): Promise<void> {
        const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
        await UserModel.findByIdAndUpdate(userId, { refreshTokenHash: tokenHash });
    }

    // Remove refresh token from database (logout)
    static async revokeRefreshToken(userId: string): Promise<void> {
        await UserModel.findByIdAndUpdate(userId, { refreshTokenHash: null });
    }

    // Check if refresh token is valid by comparing hashes
    static async isValidRefreshToken(userId: string, token: string): Promise<boolean> {
        const user = await UserModel.findById(userId);
        if (!user?.refreshTokenHash) return false;

        const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
        return user.refreshTokenHash === tokenHash;
    }
}