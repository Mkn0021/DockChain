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

export const issueDocumentSchema = z.object({
    body: documentSchema.omit({ id: true, blockchain: true, revokedAt: true, status: true })
        .extend({
            issuerId: z.string().optional()
        })
});

export const issueBulkDocumentSchema = z.object({
    body: z.object({
        templateId: z.string().nonempty("Template ID is required"),
        issuerId: z.string().optional(),
        documents: z.array(
            documentSchema.pick({ fieldValues: true, recipent: true, issuedAt: true, expiresAt: true })
        ).nonempty("At least one document must be provided")
    })
});

export const documentIdSchema = z.object({
    params: z.object({
        id: z.string().nonempty("Document ID is required")
    })
});

export const verifyDocumentSchema = z.object({
    body: z.object({
        templateId: z.string().nonempty("Template ID is required"),
        documentHash: z.string().regex(/^0x([A-Fa-f0-9]{64})$/, "Invalid document hash")
    })
});

export const verifyBulkDocumentSchema = z.object({
    body: z.object({
        templateId: z.string().nonempty("Template ID is required"),
        documentHashes: z.array(z.string().regex(/^0x([A-Fa-f0-9]{64})$/, "Invalid document hash")).nonempty("At least one document hash is required")
    })
});

export const documentQuerySchema = z.object({
    query: z.object({
        templateId: z.string().optional(),
        issuerId: z.string().optional(),
        status: z.enum(["valid", "revoked", "expired"]).optional(),
        page: z.coerce.number().int().min(1).default(1),
        limit: z.coerce.number().int().min(1).max(100).default(10),
        sort: z.record(z.string(), z.enum(['-1', '1', 'asc', 'desc'])).optional().default({ issuedAt: '-1' })
    })
});

export const generatePdfSchema = z.object({
    params: z.object({
        id: z.string().nonempty("Document ID is required")
    }),
    body: z.object({
        renderedDocument: z.string().nonempty("Rendered document is required")
    })
});

export interface DocumentAggregationResult {
    documents: Document[];
    totalCount: Array<{ count: number }>;
}


export type Document = z.infer<typeof documentSchema>;
export type IssueDocumentInput = z.infer<typeof issueDocumentSchema>['body'];
export type IssueBulkDocumentInput = z.infer<typeof issueBulkDocumentSchema>['body'];
export type revokeDocumentInput = { id: string; ownerId: string };
export type verifyDocumentInput = z.infer<typeof verifyDocumentSchema>['body'];
export type verifyBulkDocumentInput = z.infer<typeof verifyBulkDocumentSchema>['body'];
export type DocumentQueryOptions = z.infer<typeof documentQuerySchema>['query'];
export type GeneratePdfInput = { id: string; renderedDocument: string };