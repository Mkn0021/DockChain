import mongoose, { Document, Schema } from 'mongoose';
import type { Template } from '@/types/template';
import { APIError } from '@/lib/api/errors';
import { ContractCompiler } from '@/lib/blockchain/compiler';
import { ContractDeployer } from '@/lib/blockchain/deployer';

export interface ITemplate extends Document, Omit<Template, 'id' | 'createdBy'> {
    _id: mongoose.Types.ObjectId;
    createdBy: mongoose.Types.ObjectId;
}

// Template schema
const templateSchema = new Schema<ITemplate>(
    {
        name: {
            type: String,
            required: [true, 'Template name is required'],
            trim: true,
            maxlength: [100, 'Template name cannot be more than 100 characters'],
        },
        description: {
            type: String,
            trim: true,
            maxlength: [500, 'Description cannot be more than 500 characters'],
        },
        svgTemplate: {
            type: String,
            required: [true, 'SVG Template is required'],
        },
        variables: [
            {
                key: {
                    type: String,
                    required: [true, 'Variable key is required'],
                },
                type: {
                    type: String,
                    enum: ['string', 'date'],
                    required: [true, 'Variable type is required'],
                },
                required: {
                    type: Boolean,
                    default: false,
                },
            },
        ],
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Created by user is required'],
        },
        blockchain: {
            abi: {
                type: Object,
                default: null,
            },
            bytecode: {
                type: String,
                default: '',
            },
            contractSource: {
                type: String,
                default: '',
            },
            compilationStatus: {
                type: String,
                enum: ['pending', 'success', 'failed'],
                default: 'pending',
            },
            deployedAddress: {
                type: String,
                default: ''
            },
        },
    },
    {
        timestamps: true,
    }
)

// Pre-save hook to compile smart contract
templateSchema.pre('save', async function (next) {
    if (!this.isNew && !this.isModified('variables') && !this.isModified('name')) return next();

    const allFields = this.variables.map(v => v.key);
    const requiredFields = this.variables.filter(v => v.required).map(v => v.key);

    if (allFields.length === 0) {
        return next(APIError.validation('Template must have at least one variable'));
    }

    // Validate field names (must be valid Solidity identifiers)
    const invalidFields = allFields.filter(field => !/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(field));
    if (invalidFields.length > 0) {
        return next(APIError.validation(`Invalid field names: ${invalidFields.join(', ')}. Use only letters, numbers, and underscores.`));
    }
    const contractSource = ContractCompiler.generateContractSource(
        this.name,
        allFields,
        requiredFields
    );

    const compilationResult = ContractCompiler.compile(contractSource);

    const deployedAddress = await ContractDeployer.deploy(
        compilationResult.abi,
        compilationResult.bytecode
    );

    const isVerified = await ContractDeployer.verifyDeployment(deployedAddress);
    if (!isVerified) return next(APIError.validation('Contract deployment verification failed'));


    this.blockchain = {
        compilationStatus: 'success',
        abi: compilationResult.abi,
        bytecode: compilationResult.bytecode,
        contractSource,
        deployedAddress
    };

    next();
});

const TemplateModel = mongoose.models.Template || mongoose.model<ITemplate>('Template', templateSchema);

export default TemplateModel;