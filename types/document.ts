export interface Document {
    id: string;
    templateId: string;
    issuedTo: {
        name: string;
        email?: string;
        idNumber?: string;
    };
    data: Record<string, string>;
    fileName: string;
    blockchain: {
        contractAddress: string;
        network?: string;
        txHash: string;
        documentHash: string;
    };
    issuerId: string;
    issuedAt: Date;
    status: "valid" | "revoked" | "expired";
}

export interface DocumentRenderInput extends Pick<Document, 'templateId' | 'data'> { }

export interface DocumentAggregationResult {
    documents: Array<Document & {
        templateId: { _id: string; name: string; description: string; };
    }>;
    totalCount: Array<{ count: number }>;
}

export interface DocumentVerificationResult extends Omit<Document, 'templateId' | 'issuerId'> {
    template: { id: string; name: string; description: string; };
    issuer: { id: string; name: string; email: string; };
}