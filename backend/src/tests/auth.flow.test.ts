import request from 'supertest';
import { authService } from '@services/auth.service';
import APIError from '@api/errors';
import app from '../app';

// Mock the auth service
jest.mock('@services/auth.service');

// Mock the authentication middlewares
jest.mock('@middlewares/auth', () => ({
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

describe('Auth Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/auth/register', () => {
        it('should register user successfully with valid data', async () => {
            const mockUserData = {
                id: '1',
                name: 'Test User',
                email: 'test@example.com',
                isVerified: false
            };
            (authService.register as jest.Mock).mockResolvedValue({
                userData: mockUserData,
                message: 'Registration successful'
            });

            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Test User',
                    email: 'test@example.com',
                    password: 'Password123'
                });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                success: true,
                data: mockUserData,
                message: 'Registration successful'
            });
        });

        it('should return 400 for name with special characters', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Test@User',
                    email: 'test@example.com',
                    password: 'Password123'
                });

            expect(response.status).toBe(400);
        });

        it('should return 400 for name too short', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'T',
                    email: 'test@example.com',
                    password: 'Password123'
                });

            expect(response.status).toBe(400);
        });

        it('should return 400 for name too long', async () => {
            const longName = 'A'.repeat(51);
            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    name: longName,
                    email: 'test@example.com',
                    password: 'Password123'
                });

            expect(response.status).toBe(400);
        });

        it('should return 400 for password too short', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Test User',
                    email: 'test@example.com',
                    password: '123'
                });

            expect(response.status).toBe(400);
        });

        it('should return 400 for invalid email', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Test User',
                    email: 'invalid-email',
                    password: 'Password123'
                });

            expect(response.status).toBe(400);
        });

        it('should return 400 for missing required fields', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Test User'
                    // Missing email and password
                });

            expect(response.status).toBe(400);
        });

        it('should return 409 when email already exists', async () => {
            (authService.register as jest.Mock).mockRejectedValue(
                APIError.conflict('Email already exists')
            );

            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Test User',
                    email: 'existing@example.com',
                    password: 'Password123'
                });

            expect(response.status).toBe(409);
        });
    });

    describe('POST /api/auth/login', () => {
        it('should login successfully with valid credentials', async () => {
            const mockUserData = {
                id: '1',
                name: 'Test User',
                email: 'test@example.com',
                isVerified: true,
                tokens: { accessToken: 'access', refreshToken: 'refresh' }
            };
            (authService.login as jest.Mock).mockResolvedValue({
                userData: mockUserData,
                message: 'Login successful'
            });

            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'Password123'
                });

            expect(response.status).toBe(200);
            expect(response.body.data).toHaveProperty('tokens');
        });

        it('should return 401 for invalid credentials', async () => {
            (authService.login as jest.Mock).mockRejectedValue(
                APIError.unauthorized('Invalid email or password')
            );

            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'WrongPassword'
                });

            expect(response.status).toBe(401);
        });

        it('should return 403 for unverified email', async () => {
            (authService.login as jest.Mock).mockRejectedValue(
                APIError.forbidden('Please verify your email first')
            );

            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'unverified@example.com',
                    password: 'Password123'
                });

            expect(response.status).toBe(403);
        });

        it('should return 400 for missing email', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    password: 'Password123'
                });

            expect(response.status).toBe(400);
        });

        it('should return 400 for missing password', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@example.com'
                });

            expect(response.status).toBe(400);
        });
    });

    describe('POST /api/auth/verify', () => {
        it('should verify email successfully with valid OTP', async () => {
            (authService.verifyEmail as jest.Mock).mockResolvedValue(true);

            const response = await request(app)
                .post('/api/auth/verify')
                .set('Authorization', 'Bearer valid-token')
                .send({
                    email: 'test@example.com',
                    otp: '123456'
                });

            expect(response.status).toBe(200);
            expect(response.body.data.isVerified).toBe(true);
        });

        it('should return 400 for OTP not 6 digits', async () => {
            const response = await request(app)
                .post('/api/auth/verify')
                .set('Authorization', 'Bearer valid-token')
                .send({
                    email: 'test@example.com',
                    otp: '12345'
                });

            expect(response.status).toBe(400);
        });

        it('should return 400 for OTP too long', async () => {
            const response = await request(app)
                .post('/api/auth/verify')
                .set('Authorization', 'Bearer valid-token')
                .send({
                    email: 'test@example.com',
                    otp: '1234567'
                });

            expect(response.status).toBe(400);
        });

        it('should return 400 for missing OTP', async () => {
            const response = await request(app)
                .post('/api/auth/verify')
                .set('Authorization', 'Bearer valid-token')
                .send({
                    email: 'test@example.com'
                });

            expect(response.status).toBe(400);
        });

        it('should return 400 for invalid email', async () => {
            const response = await request(app)
                .post('/api/auth/verify')
                .set('Authorization', 'Bearer valid-token')
                .send({
                    email: 'invalid-email',
                    otp: '123456'
                });

            expect(response.status).toBe(400);
        });

        it('should return 401 for invalid verification token', async () => {
            (authService.verifyEmail as jest.Mock).mockRejectedValue(
                APIError.unauthorized('Invalid verification token')
            );

            const response = await request(app)
                .post('/api/auth/verify')
                .set('Authorization', 'Bearer valid-token')
                .send({
                    email: 'test@example.com',
                    otp: '123456'
                });

            expect(response.status).toBe(401);
        });
    });

    describe('POST /api/auth/refresh', () => {
        it('should refresh tokens successfully with valid refresh token', async () => {
            const mockTokens = { accessToken: 'new-access', refreshToken: 'new-refresh' };
            (authService.refresh as jest.Mock).mockResolvedValue(mockTokens);

            const response = await request(app)
                .post('/api/auth/refresh')
                .set('Authorization', 'Bearer valid-token')
                .send({
                    refreshToken: 'valid-refresh-token'
                });

            expect(response.status).toBe(200);
            expect(response.body.data).toEqual(mockTokens);
        });

        it('should return 400 for empty refresh token', async () => {
            const response = await request(app)
                .post('/api/auth/refresh')
                .set('Authorization', 'Bearer valid-token')
                .send({
                    refreshToken: ''
                });

            expect(response.status).toBe(400);
        });

        it('should return 400 for missing refresh token', async () => {
            const response = await request(app)
                .post('/api/auth/refresh')
                .set('Authorization', 'Bearer valid-token')
                .send({});

            expect(response.status).toBe(400);
        });

        it('should return 401 for invalid refresh token', async () => {
            (authService.refresh as jest.Mock).mockRejectedValue(
                APIError.unauthorized('Invalid refresh token')
            );

            const response = await request(app)
                .post('/api/auth/refresh')
                .set('Authorization', 'Bearer valid-token')
                .send({
                    refreshToken: 'invalid-token'
                });

            expect(response.status).toBe(401);
        });

        it('should return 401 for expired refresh token', async () => {
            (authService.refresh as jest.Mock).mockRejectedValue(
                APIError.unauthorized('Refresh token expired')
            );

            const response = await request(app)
                .post('/api/auth/refresh')
                .set('Authorization', 'Bearer valid-token')
                .send({
                    refreshToken: 'expired-token'
                });

            expect(response.status).toBe(401);
        });
    });

    describe('POST /api/auth/logout', () => {
        it('should logout successfully with valid authentication', async () => {
            (authService.logout as jest.Mock).mockResolvedValue({
                message: 'Logout successful'
            });

            const response = await request(app)
                .post('/api/auth/logout')
                .set('Authorization', 'Bearer valid-token');

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Logout successful');
        });

        it('should return 401 without authentication token', async () => {
            const response = await request(app)
                .post('/api/auth/logout');

            expect(response.status).toBe(401);
        });

        it('should return 401 for invalid authentication token', async () => {
            const response = await request(app)
                .post('/api/auth/logout')
                .set('Authorization', 'Bearer invalid-token');

            expect(response.status).toBe(401);
        });

        it('should return 404 when user not found during logout', async () => {
            (authService.logout as jest.Mock).mockRejectedValue(
                APIError.notFound('User not found')
            );

            const response = await request(app)
                .post('/api/auth/logout')
                .set('Authorization', 'Bearer valid-token');

            expect(response.status).toBe(404);
        });
    });

    describe('POST /api/auth/forgot-password', () => {
        it('should send reset email for valid email', async () => {
            (authService.forgotPassword as jest.Mock).mockResolvedValue({
                message: 'Password reset email sent'
            });

            const response = await request(app)
                .post('/api/auth/forgot-password')
                .send({
                    email: 'test@example.com'
                });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Password reset email sent');
        });

        it('should return 400 for invalid email format', async () => {
            const response = await request(app)
                .post('/api/auth/forgot-password')
                .send({
                    email: 'invalid-email'
                });

            expect(response.status).toBe(400);
        });

        it('should return 400 for missing email', async () => {
            const response = await request(app)
                .post('/api/auth/forgot-password')
                .send({});

            expect(response.status).toBe(400);
        });

        it('should return 404 for non-existent email', async () => {
            (authService.forgotPassword as jest.Mock).mockRejectedValue(
                APIError.notFound('User not found')
            );

            const response = await request(app)
                .post('/api/auth/forgot-password')
                .send({
                    email: 'nonexistent@example.com'
                });

            expect(response.status).toBe(404);
        });

        it('should still return 200 for unverified email', async () => {
            (authService.forgotPassword as jest.Mock).mockResolvedValue({
                message: 'If the email exists, a reset link has been sent'
            });

            const response = await request(app)
                .post('/api/auth/forgot-password')
                .send({
                    email: 'unverified@example.com'
                });

            expect(response.status).toBe(200);
        });
    });

    describe('POST /api/auth/reset-password', () => {
        it('should reset password successfully with valid data', async () => {
            (authService.resetPassword as jest.Mock).mockResolvedValue({
                message: 'Password reset successful'
            });

            const response = await request(app)
                .post('/api/auth/reset-password')
                .send({
                    email: 'test@example.com',
                    otp: '123456',
                    newPassword: 'NewPassword123'
                });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Password reset successful');
        });

        it('should return 400 for OTP not 6 digits', async () => {
            const response = await request(app)
                .post('/api/auth/reset-password')
                .send({
                    email: 'test@example.com',
                    otp: '12345',
                    newPassword: 'NewPassword123'
                });

            expect(response.status).toBe(400);
        });

        it('should return 400 for weak new password', async () => {
            const response = await request(app)
                .post('/api/auth/reset-password')
                .send({
                    email: 'test@example.com',
                    otp: '123456',
                    newPassword: '123' // Too short
                });

            expect(response.status).toBe(400);
        });

        it('should return 400 for missing email', async () => {
            const response = await request(app)
                .post('/api/auth/reset-password')
                .send({
                    otp: '123456',
                    newPassword: 'NewPassword123'
                });

            expect(response.status).toBe(400);
        });

        it('should return 400 for missing OTP', async () => {
            const response = await request(app)
                .post('/api/auth/reset-password')
                .send({
                    email: 'test@example.com',
                    newPassword: 'NewPassword123'
                });

            expect(response.status).toBe(400);
        });

        it('should return 400 for missing new password', async () => {
            const response = await request(app)
                .post('/api/auth/reset-password')
                .send({
                    email: 'test@example.com',
                    otp: '123456'
                });

            expect(response.status).toBe(400);
        });

        it('should return 401 for invalid OTP', async () => {
            (authService.resetPassword as jest.Mock).mockRejectedValue(
                APIError.unauthorized('Invalid OTP')
            );

            const response = await request(app)
                .post('/api/auth/reset-password')
                .send({
                    email: 'test@example.com', 
                    otp: '123456',             // wrong OTP   
                    newPassword: 'NewPassword123' 
                });

            expect(response.status).toBe(401);
        });

        it('should return 401 for expired OTP', async () => {
            (authService.resetPassword as jest.Mock).mockRejectedValue(
                APIError.unauthorized('OTP expired')
            );

            const response = await request(app)
                .post('/api/auth/reset-password')
                .send({
                    email: 'test@example.com',
                    otp: '123456',
                    newPassword: 'NewPassword123'
                });

            expect(response.status).toBe(401);
        });
    });

    // Edge cases for all routes
    describe('Common Edge Cases', () => {
        it('should handle malformed JSON in request body', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .set('Content-Type', 'application/json')
                .send('{"email": "test@example.com", "password": "123"'); // Missing closing brace

            expect(response.status).toBe(400);
        });

        it('should handle very long input strings', async () => {
            const longString = 'A'.repeat(10000);
            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    name: longString,
                    email: 'test@example.com',
                    password: 'Password123'
                });

            expect(response.status).toBe(400); // Name too long validation
        });

        it('should handle SQL injection attempts in email', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: "test@example.com'; DROP TABLE users; --",
                    password: "Password123"
                });

            // Should be handled by email validation
            expect(response.status).not.toBe(500);
        });

        it('should handle XSS attempts in name field', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    name: '<script>alert("xss")</script>',
                    email: 'test@example.com',
                    password: 'Password123'
                });

            // Should be rejected by name validation regex
            expect(response.status).toBe(400);
        });

        it('should handle empty request body', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send();

            expect(response.status).toBe(400);
        });

        it('should handle unexpected server errors gracefully', async () => {
            (authService.register as jest.Mock).mockRejectedValue(
                APIError.internal('Unexpected database failure')
            );

            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Test User',
                    email: 'test@example.com',
                    password: 'Password123'
                });

            expect(response.status).toBe(500);
        });
    });
});