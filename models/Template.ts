import mongoose, { Document, Schema } from 'mongoose';
import type { Template, SolcOutput } from '../types/template';
import * as solc from 'solc';
import { APIError } from '../lib/api/errors';

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
        },
    },
    {
        timestamps: true,
    }
)

// Pre-save hook to compile smart contract
templateSchema.pre('save', async function (next) {
    if (!this.isNew && !this.isModified('variables') && !this.isModified('name')) return next();

    const requiredFields = this.variables.map(v => v.key);
    const { contractSource, inputForSolc } = compileContract(this.name, requiredFields);

    const output: SolcOutput = JSON.parse(solc.compile(JSON.stringify(inputForSolc)));

    if (output.errors) {
        return next(APIError.validation("Smart contract compilation failed", output.errors));
    }

    const contractName = Object.keys(output.contracts['Contract.sol'])[0];
    const contract = output.contracts['Contract.sol'][contractName];

    this.blockchain = {
        compilationStatus: 'success',
        abi: contract.abi,
        bytecode: contract.evm.bytecode.object,
        contractSource
    };

    next();
});

// Contract compilation utility
function compileContract(templateName: string, requiredFields: string[]) {
    const contractSource = `
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract DocumentTemplate {
    string public Document_Type = "${templateName}";
    string public Issued_Time;
    ${requiredFields.map(field => `string public ${field};`).join('\n    ')}

    constructor(${requiredFields.map(field => `string memory _${field}`).join(', ')}, string memory _Issued_Time) {
        ${requiredFields.map(field => `${field} = _${field};`).join('\n        ')}
        Issued_Time = _Issued_Time;
    }
}`;

    const inputForSolc = {
        language: 'Solidity',
        sources: {
            'Contract.sol': {
                content: contractSource,
            },
        },
        settings: {
            outputSelection: {
                '*': {
                    '*': ['*'],
                },
            },
        },
    };

    return { contractSource, inputForSolc };
}

const TemplateModel = mongoose.models.Template || mongoose.model<ITemplate>('Template', templateSchema);

export default TemplateModel;