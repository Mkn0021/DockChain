import { z } from 'zod';

export type FieldType = "string" | "date" | "number" | "boolean" | "address";

export interface DocumentField {
    key: string;
    type: FieldType;
    required?: boolean;
}

export const IssueDocumentParamsSchema = z.object({
    docHash: z.string().regex(/^0x[a-fA-F0-9]{64}$/, "Invalid document hash format"),
    fields: z.array(z.object({
        key: z.string().min(1, "Field key is required")
            .regex(/^[a-zA-Z0-9\s]+$/, "Field key must start with a letter or underscore"),
        type: z.enum(['string', 'date'], "Field type must be either 'string' or 'date'"),
        required: z.boolean().optional().default(true)
    })).nonempty("At least one field is required"),
    gasLimit: z.number().positive().optional().default(500000)
});

export interface DocumentVerificationResult {
    exists: boolean;
    isValid: boolean;
    issuer: string;
    timestamp: bigint;
}

export interface TemplateInfo {
    templateType: string;
    contractOwner: string;
    totalDocuments: bigint;
}

export interface DocumentDataResult {
    hash: string;
    issuer: string;
    timestamp: bigint;
    revoked: boolean;
    [key: string]: string | Date | number | boolean | bigint;
}

export type IssueDocumentParams = z.infer<typeof IssueDocumentParamsSchema>;