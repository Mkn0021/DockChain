import { z } from 'zod';
import type { InterfaceAbi } from 'ethers';

export interface CompilationResult {
    abi: InterfaceAbi;
    bytecode: string;
    contractName: string;
}

export interface SolcError {
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

export const ContractCompileSchema = z.object({
    templateName: z.string().nonempty("templateName cannot be empty"),
    allFields: z.array(z.string()).nonempty("allFields cannot be empty"),
    requiredFields: z.array(z.string()).nonempty("requiredFields cannot be empty")
});

export type ContractCompileInput = z.infer<typeof ContractCompileSchema>;