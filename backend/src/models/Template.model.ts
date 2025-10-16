import { Template } from "@type/template.type";
import mongoose, { Schema, Document } from "mongoose";
import { ContractCompiler } from "@blockchain/compiler";
import { ContractDeployer } from "@blockchain/deployer";


export interface ITemplate extends Document, Omit<Template, 'id' | 'createdBy'> {
    _id: mongoose.Types.ObjectId;
    createdBy: mongoose.Types.ObjectId;
    toJSON(): Template;
}


const TemplateSchema = new Schema<ITemplate>(
    {
        name: { type: String, required: true, trim: true, maxlength: 100 },
        description: { type: String, trim: true, maxlength: 500 },
        svgTemplate: { type: String, required: true },
        fields: [{
            key: { type: String, required: true },
            type: { type: String, enum: ['string', 'date'], required: true },
            required: { type: Boolean, default: true }
        }],
        blockchain: {
            abi: { type: Schema.Types.Mixed, required: true },
            bytecode: { type: String, required: true },
            contractSource: { type: String, required: true },
            compilationStatus: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
            contractAddress: { type: String, default: null },
            deployedAddress: { type: String, default: null },
        },
        createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    },
    { timestamps: true }
);

// TODO: offload this to a background job queue for better performance
TemplateSchema.pre<ITemplate>('save', async function (next) {
    if (!this.isNew && !this.isModified('fields') && !this.isModified('name')) {
        return next();
    }

    try {
        const contractSource = ContractCompiler.generateContractSource({
            templateName: this.name,
            allFields: this.fields.map(f => f.key),
            requiredFields: this.fields.filter(f => f.required).map(f => f.key)
        });

        const compilationResult = ContractCompiler.compile(contractSource);

        if (!compilationResult.abi || !compilationResult.bytecode) {
            throw new Error('Compilation did not produce ABI or bytecode');
        }

        const deployedAddress = await ContractDeployer.deploy({
            abi: compilationResult.abi,
            bytecode: compilationResult.bytecode
        });

        const isVerified = ContractDeployer.verifyDeployment(deployedAddress);
        if (!isVerified) {
            throw new Error('Contract deployment verification failed');
        }

        // Only update blockchain data if all steps succeeded
        this.blockchain = {
            abi: compilationResult.abi,
            bytecode: compilationResult.bytecode,
            contractSource,
            compilationStatus: 'success',
            contractAddress: deployedAddress,
            deployedAddress
        };

        next();

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Contract processing failed';
        next(new Error(`Cannot save template: ${errorMessage}`));
    }
});



TemplateSchema.methods.toJSON = function (): Template {
    const { _id, fields, createdBy, ...rest } = this.toObject();

    const safeTemplate: Template = {
        id: _id.toString(),
        fields: fields.map(({ _id, ...field }: { _id: mongoose.Types.ObjectId } & Template['fields'][number]) => ({
            id: _id.toString(),
            ...field,
        })),
        createdBy: createdBy.toString(),
        ...rest,
    }

    return safeTemplate;
};

const TemplateModel = mongoose.models.Template || mongoose.model<ITemplate>('Template', TemplateSchema);

export default TemplateModel;