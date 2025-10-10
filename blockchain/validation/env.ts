import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

export const EnvSchema = z.object({
  HARDHAT_URL: z.string().nonempty("HARDHAT_URL cannot be empty").url(),
  HARDHAT_PRIVATE_KEY: z.string()
    .nonempty("HARDHAT_PRIVATE_KEY cannot be empty")
    .regex(/^0x[a-fA-F0-9]{64}$/, "HARDHAT_PRIVATE_KEY must be a 32-byte hex string with 0x prefix"),
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
