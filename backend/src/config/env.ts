import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

export const EnvSchema = z.object({
    MONGODB_URI: z.url().nonempty("MONGODB_URI cannot be empty"),
    ALLOWED_ORIGINS: z.string().default("*"),
    PORT: z.coerce.number().default(4000),
    JWT_ACCESS_SECRET: z.string().min(32, "JWT_ACCESS_SECRET must be at least 32 characters"),
    JWT_REFRESH_SECRET: z.string().min(32, "JWT_REFRESH_SECRET must be at least 32 characters"),
    EMAIL_USER: z.email("Invalid EMAIL_USER").nonempty("EMAIL_USER is required for email services"),
    EMAIL_PASS: z.string().nonempty("EMAIL_PASS is required for email services"),
    GOOGLE_CLIENT_ID: z.string().nonempty("GOOGLE_CLIENT_ID is required for Google OAuth"),
    GOOGLE_CLIENT_SECRET: z.string().nonempty("GOOGLE_CLIENT_SECRET is required for Google OAuth"),
    BASE_URL: z.url().default("http://localhost:4000"),
});

export const env = (() => {
    const result = EnvSchema.safeParse(process.env);
    if (!result.success) {
        throw new Error(
            `Invalid environment variables:\n${result.error.issues
                .map(i => `${i.path}: ${i.message}`)
                .join("\n")}`
        );
    }
    return result.data;
})();