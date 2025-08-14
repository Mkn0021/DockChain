import mongoose, { Document as MongooseDoc, Schema } from 'mongoose';
import { ethers, JsonRpcProvider, FunctionFragment } from 'ethers';
import * as web3Validator from 'web3-validator';
import type { Document } from '../types/document';
import Template, { ITemplate } from './Template';
import { APIError } from '../lib/api/errors';

export interface IDocument extends MongooseDoc, Omit<Document, 'id' | 'templateId' | 'issuerId'> {
    _id: mongoose.Types.ObjectId;
    templateId: mongoose.Types.ObjectId;
    issuerId: mongoose.Types.ObjectId;
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
                required: [true, 'Contract address is required'],
                trim: true,
            },
            network: {
                type: String,
                required: [true, 'Network is required'],
                trim: true,
            },
            txHash: {
                type: String,
                required: [true, 'Transaction hash is required'],
                trim: true,
            },
            documentHash: {
                type: String,
                required: [true, 'Document hash is required'],
                trim: true,
            },
            abi: {
                type: Object,
                default: {},
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

// Method to verify if the document is valid
documentSchema.methods.verifyDocument = async function (): Promise<boolean> {
    const document = this;
    const contractAddress = document.blockchain.contractAddress;

    if (!web3Validator.isAddress(contractAddress)) {
        throw APIError.validation("Contract Address is not Valid");
    }

    const template: ITemplate | null = await Template.findById(document.templateId);
    if (!template) throw APIError.notFound("Template not found");


    const provider = new JsonRpcProvider(process.env.HARDHAT_URL);

    const code = await provider.getCode(contractAddress);
    if (code === "0x" || code === "0x0") throw APIError.notFound("Contract is not Deployed");

    const contract = new ethers.Contract(contractAddress, template.blockchain.abi, provider);
    const contractInterface = new ethers.Interface(template.blockchain.abi);


    const viewFunctions = contractInterface.fragments.filter(
        (fragment): fragment is FunctionFragment =>
            fragment.type === "function" &&
            fragment.inputs.length === 0 &&
            "stateMutability" in fragment &&
            fragment.stateMutability === "view"
    );

    for (const fn of viewFunctions) {
        try {
            await contract[fn.name]();
        } catch (err) {
            throw APIError.validation(`Unable to read contract data for "${fn.name}"`);
        }
    }

    if (document.status !== 'valid') {
        throw APIError.validation(`Document status is ${document.status}`);
    }

    return true;
};

const DocumentModel = mongoose.models.Document || mongoose.model<IDocument>('Document', documentSchema);

export default DocumentModel;