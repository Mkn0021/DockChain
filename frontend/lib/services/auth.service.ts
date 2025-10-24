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
            if (userData.accessToken) {
                localStorage.setItem('accessToken', userData.accessToken);
            }
            if (userData.refreshToken) {
                localStorage.setItem('refreshToken', userData.refreshToken);
            }

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

    logout() {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
    }

    isAuthenticated(): boolean {
        return !!localStorage.getItem('accessToken');
    }

    getUser() {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }
}

export const authService = new AuthService();
