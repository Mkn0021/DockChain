import { z } from "zod";

export const documentSchema = z.object({
    id: z.string().optional(),
    templateId: z.string().nonempty("Template ID is required"),

    fieldValues: z.record(
        z.string().min(1),
        z.union([
            z.string().min(1, "Field value is required"),
            z.date(),
        ])
    ).refine(obj => Object.keys(obj).length > 0, { message: "At least one field value must be provided" }),

    recipent: z.object({
        name: z.string().min(1, "Recipient name is required").max(100, "Name too long"),
        email: z.email("Invalid Recipient email").optional(),
        walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid wallet address").optional(),
        phoneNumber: z.string().optional()
    }),

    blockchain: z.object({
        contractAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid contract address"),
        network: z.string().optional(),
        txHash: z.string().regex(/^0x([A-Fa-f0-9]{64})$/, "Invalid transaction hash"),
        documentHash: z.string().regex(/^0x([A-Fa-f0-9]{64})$/, "Invalid document hash")
    }),

    issuerId: z.string().min(1, "Issuer ID is required"),
    issuedAt: z.coerce.date().default(() => new Date()),
    expiresAt: z.coerce.date().optional(),
    revokedAt: z.coerce.date().optional(),

    status: z.enum(["valid", "revoked", "expired"]).default("valid"),
});

export type Document = z.infer<typeof documentSchema>;