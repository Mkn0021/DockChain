import { z } from "zod";

export const SendMailSchema = z.object({
    to: z.email("Invalid email address"),
    subject: z.string().min(1, "Subject cannot be empty"),
    text: z.string().min(1, "Email content cannot be empty")
});

export type SendMailData = z.infer<typeof SendMailSchema>;