import ApiClient from '@/lib/api-client';
import { RegisterPayload, LoginPayload, LoginResponse, VerifyEmailPayload, ForgotPasswordPayload } from '@/types/auth.type';

class AuthService {
    async register(payload: RegisterPayload) {
        return await ApiClient.post('/auth/register', payload);
    }

    async login(payload: LoginPayload) {
        const response = await ApiClient.post('/auth/login', payload);

        if (response.success && response.data) {
            const userData = response.data as LoginResponse;

            localStorage.setItem('user', JSON.stringify({
                id: userData.id,
                name: userData.name,
                email: userData.email,
                role: userData.role,
                isVerified: userData.isVerified
            }));
        }

        return response;
    }

    async verifyEmail(payload: VerifyEmailPayload) {
        return await ApiClient.post('/auth/verify', payload);
    }

    async forgotPassword(payload: ForgotPasswordPayload) {
        return await ApiClient.post('/auth/forgot-password', payload);
    }

    async refreshToken(): Promise<boolean> {
        try {
            const response = await ApiClient.post('/auth/refresh', {});
            return response.success;
        } catch (error) {
            console.error('Failed to refresh token:', error);
            return false;
        }
    }

    async logout() {
        try {
            await ApiClient.post('/auth/logout', {});
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            this.clearAuthData();
        }
    }

    isAuthenticated(): boolean {
        if (typeof window === 'undefined') return false;
        return !!localStorage.getItem('user');
    }

    getUser() {
        if (typeof window === 'undefined') return null;
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }

    clearAuthData() {
        if (typeof window === 'undefined') return;
        localStorage.removeItem('user');
    }
}

export const authService = new AuthService();
