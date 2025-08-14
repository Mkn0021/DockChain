import mongoose, { Document as MongooseDoc, Schema } from 'mongoose';
import { ethers, JsonRpcProvider, ContractFactory } from 'ethers';
import crypto from 'crypto';
import type { Document } from '../types/document';
import Template, { ITemplate } from './Template';
import { APIError } from '../lib/api/errors';

export interface IDocument extends MongooseDoc, Omit<Document, 'id' | 'templateId' | 'issuerId'> {
    _id: mongoose.Types.ObjectId;
    templateId: mongoose.Types.ObjectId;
    issuerId: mongoose.Types.ObjectId;
}

// Static methods interface for Document model
export interface IDocumentModel extends mongoose.Model<IDocument> {
    verifyDocument(contractAddress: String): Promise<boolean>;
    renderDocument(templateId: string, data: Map<string, string> | Record<string, string>): Promise<string>;
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
            type: Map,
            of: String,
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

    if (!template.blockchain.bytecode) {
        return next(APIError.validation("Template bytecode not found"));
    }

    const provider = new JsonRpcProvider(process.env.HARDHAT_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

    const factory = new ContractFactory(template.blockchain.abi, template.blockchain.bytecode, wallet);

    const constructorArgs = Object.values(this.data);

    const deployTx = await factory.deploy(...constructorArgs);
    const contract = await deployTx.waitForDeployment();
    const contractAddress = await contract.getAddress();
    const deploymentTx = contract.deploymentTransaction();
    if (!deploymentTx) return next(APIError.internal("Deployment transaction not found"));

    const documentHash = crypto
        .createHash('sha256')
        .update(JSON.stringify(this.data))
        .digest('hex');

    this.blockchain = {
        contractAddress,
        txHash: deploymentTx.hash,
        documentHash,
        network: (await provider.getNetwork()).name,
    };

    next();
});

// Static method to render document with template and data
documentSchema.statics.renderDocument = async function (
    templateId: string,
    data: Map<string, string> | Record<string, string>
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

// Static method to verify external document data against blockchain
documentSchema.statics.verifyDocument = async function (
    contractAddress: String
): Promise<boolean> {
    if (!contractAddress || typeof contractAddress !== 'string' ||
        !/^(0x)?[0-9a-f]{40}$/i.test(contractAddress.toLowerCase().startsWith('0x') ? contractAddress : `0x${contractAddress}`)) {
        throw APIError.validation("Contract Address is not Valid");
    }

    const document: IDocument | null = await this.findOne({ 'blockchain.contractAddress': contractAddress });
    if (!document) throw APIError.notFound("Document not found for the given contract address");

    const template: ITemplate | null = await Template.findById(document.templateId).select('blockchain.abi variables');
    if (!template || !template.blockchain.abi) {
        throw APIError.notFound("Template or ABI not found");
    }

    const provider = new JsonRpcProvider(process.env.HARDHAT_URL);

    const code = await provider.getCode(contractAddress);
    if (code === "0x" || code === "0x0") throw APIError.notFound("Contract is not Deployed");

    const contract = new ethers.Contract(contractAddress, template.blockchain.abi, provider);
    const contractData: Record<string, string> = {};
    
    for (const variable of template.variables) {
        try {
            const result = await contract[variable.key]();
            contractData[variable.key] = String(result);
        } catch {
            throw APIError.validation(`Unable to read contract data for field "${variable.key}"`);
        }
    }

    // The pre-save hook uses Object.values(this.data), so need to match that structure
    const contractDataHash = crypto
        .createHash('sha256')
        .update(JSON.stringify(contractData))
        .digest('hex');

    if (document.blockchain.documentHash !== contractDataHash) {
        throw APIError.validation("Document hash verification failed - data mismatch");
    }

    if (document.status !== 'valid') {
        throw APIError.validation(`Document status is ${document.status}`);
    }

    return true;
};

const DocumentModel = mongoose.models.Document || mongoose.model<IDocument, IDocumentModel>('Document', documentSchema);

export default DocumentModel;