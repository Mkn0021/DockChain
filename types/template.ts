import type { InterfaceAbi } from 'ethers';

export interface Template {
    id: string;
    name: string;
    description?: string;
    svgTemplate: string;
    variables: {
        key: string;
        type: "string" | "number" | "date" | "image";
        required: boolean;
    }[];
    createdBy: string;
    blockchain: {
        abi?: InterfaceAbi | null;
        bytecode?: string;
        contractSource?: string;
        compilationStatus?: 'pending' | 'success' | 'failed';
    };
    createdAt: Date;
    updatedAt: Date;
}

export interface TemplateAggregationResult {
    templates: Template[];
    totalCount: Array<{ count: number }>;
}

export interface SolcOutput {
    contracts: {
        [fileName: string]: {
            [contractName: string]: {
                abi: InterfaceAbi;
                evm: {
                    bytecode: {
                        object: string;
                    };
                };
            };
        };
    };
    errors?: Array<{
        severity: 'error' | 'warning';
        message: string;
        formattedMessage?: string;
    }>;
}