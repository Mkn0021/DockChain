import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

export const EnvSchema = z.object({
    MONGODB_URI: z.url().nonempty("MONGODB_URI cannot be empty"),
    ALLOWED_ORIGINS: z.string().default("*"),
    PORT: z.coerce.number().default(4000),
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