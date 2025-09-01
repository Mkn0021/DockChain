import type { InterfaceAbi } from 'ethers';

export interface IssueDocumentResult {
    docHash: string;
    transactionHash: string;
}

export interface VerifyDocumentResult {
    docHash: string;
    exists: boolean;
    isValid: boolean;
    issuer: string;
    timestamp: number;
}

export interface CompilationResult {
    abi: InterfaceAbi;
    bytecode: string;
    contractName: string;
}

export interface TemplateBlockchainData {
    abi: InterfaceAbi;
    bytecode: string;
    contractSource: string;
    compilationStatus: 'pending' | 'success' | 'failed';
    deployedAddress: string;
}


export interface TransactionReceipt {
    transactionHash: string;
    transactionIndex: number;
    blockHash: string;
    blockNumber: number;
    from: string;
    to: string | null;
    cumulativeGasUsed: number;
    gasUsed: number;
    contractAddress: string | null;
    logs: any[];
    status: boolean;
}

interface SolcError {
    severity: 'error' | 'warning';
    message: string;
    component: string;
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
    errors?: SolcError[];
}