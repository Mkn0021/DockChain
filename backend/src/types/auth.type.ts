import { z } from "zod";
import { userSchema } from "./user.type";

const passwordSchema = z.string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password too long");

export const RegisterSchema = z.object({
    body: z.object({
        name: userSchema.shape.name,
        email: userSchema.shape.email,
        password: passwordSchema,
    })
});

export const LoginSchema = z.object({
    body: z.object({
        email: userSchema.shape.email,
        password: passwordSchema,
    })
});

export const VerifyEmailSchema = z.object({
    body: z.object({
        email: userSchema.shape.email,
        otp: z.string().length(6, "OTP must be 6 digits"),
    })
});

export const ResetPasswordSchema = z.object({
    body: z.object({
        email: userSchema.shape.email,
        otp: z.string().length(6, "OTP must be 6 digits"),
        newPassword: passwordSchema,
    })
});

export const RefreshTokenSchema = z.object({
    body: z.object({
        refreshToken: z.string().min(1, "Refresh token is required")
    })
});

export const ForgotPasswordSchema = z.object({
    body: z.object({
        email: z.string().email("Invalid email address")
    })
});

export const GoogleLoginSchema = z.object({
    body: z.object({
        code: z.string().min(1, "Authorization code is required")
    })
});

export type RegisterData = z.infer<typeof RegisterSchema>['body'];
export type LoginData = z.infer<typeof LoginSchema>['body'];
export type VerifyEmailData = z.infer<typeof VerifyEmailSchema>['body'];
export type ResetPasswordData = z.infer<typeof ResetPasswordSchema>['body'];
