import { Document } from "@type/document.type";
import mongoose, { Schema, Document as MongooseDocument } from "mongoose";

export interface IDocument extends MongooseDocument, Omit<Document, 'id' | 'templateId' | 'issuerId'> {
    _id: mongoose.Types.ObjectId;
    templateId: mongoose.Types.ObjectId;
    issuerId: mongoose.Types.ObjectId;
    toJSON(): Document;
}

const DocumentSchema = new Schema<IDocument>(
    {
        templateId: { type: Schema.Types.ObjectId, ref: 'Template', required: true },
        fieldValues: { type: Map, of: Schema.Types.Mixed, required: true },
        recipent: {
            name: { type: String, required: true, trim: true, maxlength: 100 },
            email: { type: String, trim: true, maxlength: 100 },
            walletAddress: { type: String, trim: true, maxlength: 42 },
            phoneNumber: { type: String, trim: true, maxlength: 20 }
        },
        blockchain: {
            contractAddress: { type: String, required: true },
            network: { type: String, trim: true, maxlength: 100 },
            txHash: { type: String, required: true },
            documentHash: { type: String, required: true }
        },
        issuerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        issuedAt: { type: Date, required: true },
        expiresAt: { type: Date },
        revokedAt: { type: Date },
        status: { type: String, enum: ['valid', 'revoked', 'expired'], default: 'valid' }
    },
    { timestamps: true }
);

DocumentSchema.methods.toJSON = function (): Document {
    const { _id, templateId, issuerId, ...rest } = this.toObject();

    const safeDocument: Document = {
        id: this._id.toString(),
        templateId: this.templateId.toString(),
        issuerId: this.issuerId.toString(),
        ...rest
    };

    return safeDocument;
}

const DocumentModel = mongoose.models.Document || mongoose.model<IDocument>('Document', DocumentSchema);

export default DocumentModel;