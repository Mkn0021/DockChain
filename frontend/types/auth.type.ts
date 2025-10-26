export interface FormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    otp: string;
}

export interface RegisterPayload {
    name: string;
    email: string;
    password: string;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface VerifyEmailPayload {
    email: string;
    otp: string;
}

export interface ForgotPasswordPayload {
    email: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    isVerified: boolean;
}

export interface LoginResponse extends User {
    accessToken: string;
    refreshToken: string;
}
