import { z } from "zod";
export const userSchema = z.object({
    id: z.string(),
    name: z.string()
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name too long")
        .regex(/^[a-zA-Z0-9\s]+$/, "Name can only contain letters, numbers, and spaces"),

    email: z.email("Invalid email address").toLowerCase().trim(),
    password: z.string().min(6, "Password must be at least 6 characters").optional(),

    googleId: z.string().optional(),

    isVerified: z.boolean().default(false),

    otp: z.string().optional(),
    otpExpiry: z.date().optional(),

    role: z.enum(["admin", "user"]).default("user"),

    refreshTokenHash: z.string().optional(),

    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});

export type User = z.infer<typeof userSchema>;
