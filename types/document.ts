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

export interface IssuedDocument {
    id: string;
    recipientName: string;
    recipientEmail: string;
    templateName: string;
    status: string;
    createdAt: string;
}

export interface DocumentApiInput extends Pick<Document, 'templateId' | 'data'> { }

export interface DocumentAggregationResult {
    documents: IssuedDocument[];
    totalCount: Array<{ count: number }>;
}
