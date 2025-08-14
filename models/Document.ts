import mongoose, { Document as MongooseDoc, Schema } from 'mongoose';
import { ethers, JsonRpcProvider, FunctionFragment, ContractFactory } from 'ethers';
import * as web3Validator from 'web3-validator';
import crypto from 'crypto';
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