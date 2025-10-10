import type { InterfaceAbi } from 'ethers';

export interface CompilationResult {
    abi: InterfaceAbi;
    bytecode: string;
    contractName: string;
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

export interface ContractParts {
    templateName: string;
    validationCode: string;
    allFieldsCode: string;
    parameterCode: string;
    assignmentCode: string;
    getterReturnTypes: string;
    getterReturnValues: string;
}