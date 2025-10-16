import { z } from "zod";
import { abiValidation } from "@blockchain/validation/deployer";

export const templateSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, "Template name is required")
        .max(100, "Template name cannot be more than 100 characters").trim(),
    description: z.string().max(500, "Description cannot be more than 500 characters").trim().optional(),

    svgTemplate: z.string().min(1, "SVG Template is required"),

    fields: z.array(z.object({
        key: z.string().min(1, "Template Field key is required")
            .regex(/^[a-zA-Z0-9\s]+$/, "Template Field key must start with a letter or underscore and contain only letters, numbers, or underscores"),
        type: z.enum(['string', 'date'], "Template Field type must be either 'string' or 'date'"),
        required: z.boolean().optional().default(true)
    })).nonempty("At least one field is required"),

    blockchain: z.object({
        abi: abiValidation,
        bytecode: z.string().min(1, 'Bytecode cannot be empty')
            .regex(/^0x[a-fA-F0-9]*$/, 'Bytecode must be a valid hex string')
            .refine(val => val.length >= 4, 'Bytecode too short'),
        contractSource: z.string().default(''),
        compilationStatus: z.enum(['pending', 'success', 'failed']).default('pending'),
        contractAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/i, 'Contract address must be a valid Ethereum address'),
        deployedAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/i, 'Deployed address must be a valid Ethereum address'),
    }),

    createdBy: z.string().nonempty("Creator ID is required"),

    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
})

export type Template = z.infer<typeof templateSchema>;