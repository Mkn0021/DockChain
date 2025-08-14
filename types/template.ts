import type { InterfaceAbi } from 'ethers';

export interface Template {
    id: string;
    name: string;
    description?: string;
    fileName: string;
    variables: {
        key: string;
        type: "string" | "number" | "date" | "image";
        required: boolean;
    }[];
    createdBy: string;
    blockchain: {
        abi: InterfaceAbi;
        bytecode?: string;
    };
    createdAt: Date;
    updatedAt: Date;
}