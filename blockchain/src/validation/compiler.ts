import { z } from 'zod';

export const ContractCompileSchema = z.object({
    templateName: z.string().nonempty("templateName cannot be empty"),
    allFields: z.array(z.string()).nonempty("allFields cannot be empty"),
    requiredFields: z.array(z.string()).nonempty("requiredFields cannot be empty")
});

export type ContractCompileInput = z.infer<typeof ContractCompileSchema>;