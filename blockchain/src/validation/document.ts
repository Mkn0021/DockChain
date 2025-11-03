import { z } from 'zod';

export type FieldType = "string" | "date" | "number" | "boolean" | "address";

export interface DocumentField {
    key: string;
    type: FieldType;
    required?: boolean;
}

export const IssueDocumentParamsSchema = z.object({
    docHash: z.string().regex(/^0x[a-fA-F0-9]{64}$/, "Invalid document hash format"),
    fields: z.record(
        z.string().min(1),
        z.union([
            z.string().min(1, "Field value is required"),
            z.date(),
        ])
    ).refine(obj => Object.keys(obj).length > 0, { message: "At least one field value must be provided" }),
    gasLimit: z.number().positive().optional().default(500000)
});

export interface DocumentVerificationResult {
    exists: boolean;
    isValid: boolean;
    issuer: string;
    timestamp: string;
}

export interface TemplateInfo {
    templateType: string;
    contractOwner: string;
    totalDocuments: string;
}

export interface DocumentDataResult {
    hash: string;
    issuer: string;
    timestamp: string;
    revoked: boolean;
    [key: string]: string | Date | number | boolean | string;
}

export type IssueDocumentParams = z.infer<typeof IssueDocumentParamsSchema>;