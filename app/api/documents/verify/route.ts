import { NextRequest } from 'next/server';
import { asyncHandler, apiResponse } from '@/lib/api/response';
import { APIError } from '@/lib/api/errors';
import DocumentModel from '@/models/Document';
import type { DocumentVerificationResult } from '@/types/document';

export const POST = asyncHandler(async (request: NextRequest) => {
    const { contractAddress }: { contractAddress: string } = await request.json();
    if (!contractAddress) throw APIError.validation('Contract address is required');

    const isValid = await DocumentModel.verifyDocument(contractAddress);

    if (isValid) {
        const result = await DocumentModel.aggregate<DocumentVerificationResult>([
            { $match: { 'blockchain.contractAddress': contractAddress } },
            {
                $lookup: {
                    from: 'templates',
                    localField: 'templateId',
                    foreignField: '_id',
                    as: 'template',
                    pipeline: [{ $project: { name: 1, description: 1 } }]
                }
            },
            { $unwind: '$template' },
            {
                $lookup: {
                    from: 'users',
                    localField: 'issuerId',
                    foreignField: '_id',
                    as: 'issuer',
                    pipeline: [{ $project: { name: 1, email: 1 } }]
                }
            },
            { $unwind: '$issuer' }
        ]);

        const document = result[0];
        if (!document) throw APIError.notFound('Document not found');

        const renderedSvg = await DocumentModel.renderDocument(
            document.template._id.toString(),
            document.data
        );

        return apiResponse.success({
            isValid: true,
            document,
            renderedSvg,
            message: 'Document is valid and verified'
        });
    }

    throw APIError.validation('Document verification failed');
});
