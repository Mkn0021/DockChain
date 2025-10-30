import { Request } from "express";
import { asyncHandler } from "@api/response";
import { OAuthManager } from '@utils/oauth.util';
import { authService } from "@services/auth.service";
import { AuthenticatedRequest } from "@type/request.type";
import { validateRequest } from "@middlewares/validation";
import validateAuth from "@middlewares/auth";
import {
    LoginSchema, RegisterSchema, ResetPasswordSchema,
    VerifyEmailSchema, RefreshTokenSchema, ForgotPasswordSchema, GoogleLoginSchema
} from "@type/auth.type";

export default class AuthController {

    // POST /api/auth/register
    static register = [
        validateRequest(RegisterSchema),
        asyncHandler(async (req: Request) => {
            const result = await authService.register(req.body);
            return { data: result.userData, message: result.message };
        })
    ];

    // POST /api/auth/login
    static login = [
        validateRequest(LoginSchema),
        asyncHandler(async (req: Request) => {
            const result = await authService.login(req.body);

            return {
                cookies: result.cookies,
                data: result.userData,
                message: result.message
            };
        })
    ];

    // POST /api/auth/verify
    static verifyEmail = [
        validateRequest(VerifyEmailSchema),
        asyncHandler(async (req: Request) => {
            const isVerified = await authService.verifyEmail(req.body);
            return { data: { isVerified }, message: "Email verification successful" };
        })
    ];

    // POST /api/auth/refresh
    static refresh = [
        validateAuth,
        validateRequest(RefreshTokenSchema),
        asyncHandler(async (req: Request) => {
            const authenticatedReq = req as AuthenticatedRequest;
            const result = await authService.refresh(authenticatedReq.body.refreshToken);
            
            return {
                cookies: result.cookies,
                data: result.tokens,
                message: "Tokens refreshed successfully"
            };
        })
    ];

    // POST /api/auth/logout
    static logout = [
        validateAuth,
        asyncHandler(async (req: Request) => {
            const authenticatedReq = req as AuthenticatedRequest;
            const result = await authService.logout(authenticatedReq.user.id);

            return {
                cookies: result.cookies,
                message: result.message
            };
        })
    ];

    // POST /api/auth/forgot-password
    static forgotPassword = [
        validateRequest(ForgotPasswordSchema),
        asyncHandler(async (req: Request) => {
            const result = await authService.forgotPassword(req.body.email);
            return { data: null, message: result.message };
        })
    ];

    // POST /api/auth/reset-password
    static resetPassword = [
        validateRequest(ResetPasswordSchema),
        asyncHandler(async (req: Request) => {
            const result = await authService.resetPassword(req.body);
            return { data: null, message: result.message };
        })
    ];

    // GOOGLE OAUTH ROUTES

    // GET /api/auth/google/url
    static getGoogleAuthUrl = [
        asyncHandler(async () => {
            const authUrl = OAuthManager.getAuthUrl('google');
            return {
                success: true,
                data: { authUrl },
                message: "Google auth URL generated"
            };
        })
    ];

    // POST /api/auth/google
    static googleLogin = [
        validateRequest(GoogleLoginSchema),
        asyncHandler(async (req: Request) => {
            const result = await authService.loginWithGoogle(req.body.code);
            return {
                data: result.userData,
                message: result.message
            };
        })
    ];

    // POST /api/auth/google/disconnect
    static disconnectGoogle = [
        validateAuth,
        asyncHandler(async (req: Request) => {
            const authenticatedReq = req as AuthenticatedRequest;
            const result = await authService.unlinkGoogle(authenticatedReq.user.id);
            return {
                data: null,
                message: result.message
            };
        })
    ];
}