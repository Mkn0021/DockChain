import * as solc from 'solc';
import { generateContract } from './contract'
import type { CompilationResult, SolcOutput } from './types';
import { ContractCompileSchema, ContractCompileInput } from '../validation/compiler';

export class ContractCompiler {
    static generateContractSource(contractData: ContractCompileInput): string {

        ContractCompileSchema.parse(contractData);
        const { templateName, allFields, requiredFields } = contractData;

        const validationCode = requiredFields.map(field =>
            `require(bytes(_${field}).length > 0, "${field} is required");`
        ).join('\n        ');

        const allFieldsCode = allFields.map(field => `string ${field};`).join('\n        ');
        const parameterCode = allFields.map(field => `string memory _${field}`).join(',\n        ');
        const assignmentCode = allFields.map(field => `${field}: _${field}`).join(',\n            ');
        const getterReturnTypes = allFields.map(field => `string memory ${field}`).join(',\n        ');
        const getterReturnValues = allFields.map(field => `doc.${field}`).join(',\n            ');

        return generateContract({
            templateName,
            validationCode,
            allFieldsCode,
            parameterCode,
            assignmentCode,
            getterReturnTypes,
            getterReturnValues
        });
    }


    static compile(contractSource: string): CompilationResult {
        const inputForSolc = {
            language: 'Solidity',
            sources: {
                'Contract.sol': {
                    content: contractSource,
                },
            },
            settings: {
                outputSelection: {
                    '*': {
                        '*': ['abi', 'evm.bytecode'],
                    },
                },
                optimizer: {
                    enabled: true,
                    runs: 200
                }
            },
        };

        const output: SolcOutput = JSON.parse(solc.compile(JSON.stringify(inputForSolc)));

        if (output.errors) {
            const errors = output.errors.filter(error => error.severity === 'error');
            if (errors.length > 0) {
                throw new Error(`Compilation failed: ${errors.map(e => e.message).join(', ')}`);
            }
        }

        const contractName = Object.keys(output.contracts['Contract.sol'])[0];
        const contract = output.contracts['Contract.sol'][contractName];

        return {
            abi: contract.abi,
            bytecode: contract.evm.bytecode.object,
            contractName
        };
    }
}
