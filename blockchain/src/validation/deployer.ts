import { z } from 'zod';
import type { InterfaceAbi } from 'ethers';

export const abiValidation = z.custom<InterfaceAbi>(
    (val): val is InterfaceAbi => {
        return Array.isArray(val) ||
            (typeof val === 'object' && val !== null && !Array.isArray(val));
    },
    'ABI must be a valid InterfaceAbi (array or object)'
);

export const ContractConfigSchema = z.object({
    contractAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address format'),
    abi: abiValidation,
    readOnly: z.boolean().optional()
});

export const DeploymentConfigSchema = z.object({
    abi: abiValidation,
    bytecode: z.string()
        .min(1, 'Bytecode cannot be empty')
        .regex(/^0x[a-fA-F0-9]*$/, 'Bytecode must be a valid hex string')
        .refine((val) => val.length >= 4, 'Bytecode too short')
});

export type ContractConfig = z.infer<typeof ContractConfigSchema>;
export type DeploymentConfig = z.infer<typeof DeploymentConfigSchema>;