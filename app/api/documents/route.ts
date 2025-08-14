import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { asyncHandler, apiResponse } from '@/lib/api/response';
import { APIError } from '@/lib/api/errors';
import DocumentModel, { IDocument } from '@/models/Document';
import Template from '@/models/Template';
import { authOptions } from '@/lib/auth';
import mongoose from 'mongoose';
import type { Document, DocumentAggregationResult } from '@/types/document';

export const GET = asyncHandler(async (request: NextRequest) => {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) throw APIError.unauthorized('Authentication required');

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const result = await DocumentModel.aggregate([
        { $match: { issuerId: new mongoose.Types.ObjectId(session.user.id) } },
        {
            $facet: {
                documents: [
                    { $sort: { createdAt: -1 } },
                    { $skip: skip },
                    { $limit: limit },
                    {
                        $lookup: {
                            from: 'templates',
                            localField: 'templateId',
                            foreignField: '_id',
                            as: 'templateId',
                            pipeline: [{ $project: { name: 1, description: 1 } }]
                        }
                    },
                    { $unwind: '$templateId' }
                ],
                totalCount: [{ $count: 'count' }]
            }
        }
    ]) as [DocumentAggregationResult];

    const documents = result[0].documents;
    const total = result[0].totalCount[0]?.count || 0;

    return apiResponse.success({
        documents,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
        }
    });
});

export const POST = asyncHandler(async (request: NextRequest) => {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) throw APIError.unauthorized('Authentication required');

    const body: Document = await request.json();
    const { templateId, issuedTo, data, fileName } = body;

    if (!templateId || !issuedTo || !data || !fileName) {
        throw APIError.validation('Missing required fields: templateId, issuedTo, data, fileName');
    }

    if (!mongoose.Types.ObjectId.isValid(templateId)) {
        throw APIError.validation('Invalid template ID format');
    }

    const template = await Template.findById(templateId);
    if (!template) throw APIError.notFound('Template not found');

    const document: IDocument = new DocumentModel({
        templateId,
        issuedTo,
        data: new Map(Object.entries(data)),
        fileName,
        issuerId: session.user.id
    });

    await document.save();

    return apiResponse.success({
        contractAddress: document.blockchain.contractAddress
    }, 'Document issued successfully');
});
