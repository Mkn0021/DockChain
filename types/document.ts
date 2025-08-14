import type { InterfaceAbi } from 'ethers';

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
        txHash?: string;
        documentHash?: string;
        abi?: InterfaceAbi;
    };
    issuerId: string;
    issuedAt: Date;
    status: "valid" | "revoked" | "expired";
}