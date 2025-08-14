import mongoose, { Document as MongooseDoc, Schema } from 'mongoose';
import type { Document } from '../types/document';

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

const DocumentModel = mongoose.models.Document || mongoose.model<IDocument>('Document', documentSchema);

export default DocumentModel;