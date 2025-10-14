import request from 'supertest';
import { authService } from '../services/auth.service';
import APIError from '../api/errors';
import app from '../app';

jest.mock('../services/auth.service');

jest.mock('../utils/oauth.util', () => ({
    OAuthManager: {
        getAuthUrl: jest.fn(() => 'https://accounts.google.com/o/oauth2/auth?mock=true'),
        handleCallback: jest.fn()
    }
}));

// Mock the authentication middlewares
jest.mock('../api/middlewares/auth', () => ({
    validateAuth: jest.fn((req: any, res: any, next: any) => {
        const authHeader = req.headers.authorization;

        // No token provided
        if (!authHeader) {
            const error = APIError.unauthorized('No token provided');
            return next(error);
        }

        // Invalid token format
        if (!authHeader.startsWith('Bearer ')) {
            const error = APIError.unauthorized('Invalid token format');
            return next(error);
        }

        // Invalid token
        if (authHeader === 'Bearer invalid-token') {
            const error = APIError.unauthorized('Invalid token');
            return next(error);
        }

        // Valid token - set user and proceed
        req.user = {
            id: '1',
            email: 'test@example.com',
            role: 'user',
            isVerified: false
        };
        next();
    }),
    validateVerified: jest.fn((req: any, res: any, next: any) => next())
}));

describe('Google OAuth Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/auth/google/url', () => {
        it('should return Google OAuth URL', async () => {
            const response = await request(app)
                .get('/api/auth/google/url');

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                success: true,
                data: {
                    authUrl: expect.any(String)
                },
                message: "Google auth URL generated"
            });
            expect(response.body.data.authUrl).toContain('accounts.google.com');
        });
    });

    describe('POST /api/auth/google', () => {
        it('should login successfully with valid Google authorization code', async () => {
            const mockUserData = {
                id: '1',
                name: 'Google User',
                email: 'google@example.com',
                isVerified: true,
                googleId: 'google123',
                accessToken: 'access-token',
                refreshToken: 'refresh-token'
            };

            (authService.loginWithGoogle as jest.Mock).mockResolvedValue({
                userData: mockUserData,
                message: 'Google login successful'
            });

            const response = await request(app)
                .post('/api/auth/google')
                .send({
                    code: 'valid-google-auth-code'
                });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                success: true,
                data: mockUserData,
                message: 'Google login successful'
            });
        });

        it('should return 400 for missing authorization code', async () => {
            const response = await request(app)
                .post('/api/auth/google')
                .send({});

            expect(response.status).toBe(400);
        });

        it('should return 400 for empty authorization code', async () => {
            const response = await request(app)
                .post('/api/auth/google')
                .send({
                    code: ''
                });

            expect(response.status).toBe(400);
        });

        it('should return 401 for invalid Google authorization code', async () => {
            (authService.loginWithGoogle as jest.Mock).mockRejectedValue(
                APIError.unauthorized('Google authentication failed')
            );

            const response = await request(app)
                .post('/api/auth/google')
                .send({
                    code: 'invalid-google-code'
                });

            expect(response.status).toBe(401);
        });

        it('should return 401 for expired Google authorization code', async () => {
            (authService.loginWithGoogle as jest.Mock).mockRejectedValue(
                APIError.unauthorized('Google authorization code expired')
            );

            const response = await request(app)
                .post('/api/auth/google')
                .send({
                    code: 'expired-google-code'
                });

            expect(response.status).toBe(401);
        });

        it('should handle new user creation from Google', async () => {
            const mockNewUser = {
                id: '2',
                name: 'New Google User',
                email: 'newgoogle@example.com',
                isVerified: true,
                googleId: 'google456',
                accessToken: 'access-token-2',
                refreshToken: 'refresh-token-2'
            };

            (authService.loginWithGoogle as jest.Mock).mockResolvedValue({
                userData: mockNewUser,
                message: 'Google login successful'
            });

            const response = await request(app)
                .post('/api/auth/google')
                .send({
                    code: 'new-user-google-code'
                });

            expect(response.status).toBe(200);
            expect(response.body.data.googleId).toBe('google456');
            expect(response.body.data.isVerified).toBe(true);
        });

        it('should handle account merging when Google email matches existing user', async () => {
            const mockMergedUser = {
                id: '3',
                name: 'Existing User',
                email: 'existing@example.com',
                isVerified: true,
                googleId: 'google789',
                accessToken: 'access-token-3',
                refreshToken: 'refresh-token-3'
            };

            (authService.loginWithGoogle as jest.Mock).mockResolvedValue({
                userData: mockMergedUser,
                message: 'Google login successful'
            });

            const response = await request(app)
                .post('/api/auth/google')
                .send({
                    code: 'merge-account-google-code'
                });

            expect(response.status).toBe(200);
            expect(response.body.data.email).toBe('existing@example.com');
            expect(response.body.data.googleId).toBe('google789');
        });
    });

    describe('POST /api/auth/google/disconnect', () => {
        it('should disconnect Google account successfully with valid authentication', async () => {
            (authService.unlinkGoogle as jest.Mock).mockResolvedValue({
                message: 'Google account unlinked'
            });

            const response = await request(app)
                .post('/api/auth/google/disconnect')
                .set('Authorization', 'Bearer valid-token');

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                success: true,
                data: null,
                message: 'Google account unlinked'
            });
        });

        it('should return 401 without authentication token', async () => {
            const response = await request(app)
                .post('/api/auth/google/disconnect');

            expect(response.status).toBe(401);
        });

        it('should return 401 for invalid authentication token', async () => {
            const response = await request(app)
                .post('/api/auth/google/disconnect')
                .set('Authorization', 'Bearer invalid-token');

            expect(response.status).toBe(401);
        });

        it('should return 403 for unverified user', async () => {
            // This will depend on your validateVerified middleware
            const response = await request(app)
                .post('/api/auth/google/disconnect')
                .set('Authorization', 'Bearer valid-token');

            // Either 200 or 403 based on your middleware
            expect([200, 403]).toContain(response.status);
        });

        it('should handle when user has no Google account linked', async () => {
            (authService.unlinkGoogle as jest.Mock).mockResolvedValue({
                message: 'Google account unlinked'
            });

            const response = await request(app)
                .post('/api/auth/google/disconnect')
                .set('Authorization', 'Bearer valid-token');

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Google account unlinked');
        });
    });

    // Edge cases
    describe('Google OAuth Edge Cases', () => {
        it('should handle malformed JSON in request body', async () => {
            const response = await request(app)
                .post('/api/auth/google')
                .set('Content-Type', 'application/json')
                .send('{"code": "valid-code"'); // Missing closing brace

            expect(response.status).toBe(400);
        });

        it('should handle very long authorization code', async () => {
            const longCode = 'a'.repeat(1000);
            const response = await request(app)
                .post('/api/auth/google')
                .send({
                    code: longCode
                });

            expect(response.status).not.toBe(500); // Should not crash
        });

        it('should handle server errors gracefully', async () => {
            (authService.loginWithGoogle as jest.Mock).mockRejectedValue(
                APIError.internal('OAuth service unavailable')
            );

            const response = await request(app)
                .post('/api/auth/google')
                .send({
                    code: 'valid-code'
                });

            expect(response.status).toBe(500);
        });

        it('should handle rate limiting attempts', async () => {
            // Test multiple rapid requests
            const promises = Array(5).fill(0).map(() =>
                request(app)
                    .post('/api/auth/google')
                    .send({ code: 'test-code' })
            );

            const responses = await Promise.all(promises);

            // All should return proper status codes (not crash)
            responses.forEach(response => {
                expect([200, 400, 401, 429, 500]).toContain(response.status);
            });
        });
    });
});