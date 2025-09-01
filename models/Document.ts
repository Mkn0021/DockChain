import { APIError } from '@/lib/api/errors';
import Template, { ITemplate } from './Template';
import type { Document } from '@/types/document';
import mongoose, { Document as MongooseDoc, Schema } from 'mongoose';
import { ContractDeployer } from '@/lib/blockchain/deployer';



export interface IDocument extends MongooseDoc, Omit<Document, 'id' | 'templateId' | 'issuerId'> {
    _id: mongoose.Types.ObjectId;
    templateId: mongoose.Types.ObjectId;
    issuerId: mongoose.Types.ObjectId;
}

// Static methods interface for Document model
export interface IDocumentModel extends mongoose.Model<IDocument> {
    renderDocument(templateId: string, data: Record<string, string> | Map<string, string>): Promise<string>;
}

// Document schema
const documentSchema = new Schema<IDocument>(
    {
        templateId: {
            type: Schema.Types.ObjectId,
            required: [true, 'Template ID is required'],
            ref: 'Template',
        },
        issuedTo: {
            name: {
                type: String,
                required: [true, 'Name is required'],
                trim: true,
                maxlength: [100, 'Name cannot be more than 100 characters'],
            },
            email: {
                type: String,
                trim: true,
                match: [/\S+@\S+\.\S+/, 'Please enter a valid email'],
            },
            idNumber: {
                type: String,
                trim: true,
            },
        },
        data: {
            type: Object,
            required: [true, 'Data is required'],
        },
        fileName: {
            type: String,
            required: [true, 'File name is required'],
            trim: true,
        },
        blockchain: {
            contractAddress: {
                type: String,
                trim: true,
            },
            network: {
                type: String,
                trim: true,
            },
            txHash: {
                type: String,
                trim: true,
            },
            documentHash: {
                type: String,
                trim: true,
            },
        },
        issuerId: {
            type: Schema.Types.ObjectId,
            required: [true, 'Issuer ID is required'],
            ref: 'User',
        },
        issuedAt: {
            type: Date,
            default: Date.now,
        },
        status: {
            type: String,
            enum: ['valid', 'revoked', 'expired'],
            default: 'valid',
        },
    },
    {
        timestamps: true,
    }
)

// Pre-save hook to automatically deploy contract for new documents
documentSchema.pre('save', async function (next) {
    if (!this.isNew || this.blockchain.contractAddress) return next();

    const template = await Template.findById(this.templateId);
    if (!template) return next(APIError.notFound("Template not found"));

    if (!template.blockchain.bytecode || !template.blockchain.abi) {
        return next(APIError.validation("Template bytecode or abi not found"));
    }

    const deployment = await ContractDeployer.issueDocument(
        template.blockchain.deployedAddress,
        template.blockchain.abi,
        this.data
    )

    this.blockchain = {
        contractAddress: template.blockchain.deployedAddress,
        txHash: deployment.transactionHash,
        documentHash: deployment.docHash
    };

    next();
});

// Static method to render document with template and data
documentSchema.statics.renderDocument = async function (
    templateId: string,
    data: Record<string, string> | Map<string, string>
): Promise<string> {
    const template: ITemplate | null = await Template.findById(templateId).select('svgTemplate');
    if (!template) throw APIError.notFound("Template not found");

    let renderedSvg = template.svgTemplate;

    const dataEntries = data instanceof Map
        ? data.entries()
        : Object.entries(data);

    for (const [key, value] of dataEntries) {
        const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
        renderedSvg = renderedSvg.replace(regex, value || '');
    }
    renderedSvg = renderedSvg.replace(/{{\s*\w+\s*}}/g, '');

    return renderedSvg;
};


const DocumentModel = (mongoose.models.Document as IDocumentModel) || mongoose.model<IDocument, IDocumentModel>('Document', documentSchema);

export default DocumentModel;