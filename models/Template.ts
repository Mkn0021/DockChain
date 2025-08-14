import mongoose, { Document, Schema } from 'mongoose';
import type { Template } from '../types/template';

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
        fileName: {
            type: String,
            required: [true, 'File name is required'],
            trim: true,
        },
        variables: [
            {
                key: {
                    type: String,
                    required: [true, 'Variable key is required'],
                },
                type: {
                    type: String,
                    enum: ['string', 'number', 'date', 'image'],
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
                required: [true, 'Blockchain ABI is required'],
            },
            bytecode: {
                type: String,
                default: '',
            },
        },
    },
    {
        timestamps: true,
    }
)

const Template = mongoose.models.Template || mongoose.model<ITemplate>('Template', templateSchema);

export default Template;