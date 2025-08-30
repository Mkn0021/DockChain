import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import mongoose from 'mongoose';
import { asyncHandler, apiResponse } from '@/lib/api/response';
import { APIError } from '@/lib/api/errors';
import TemplateModel, { ITemplate } from '@/models/Template';
import { authOptions } from '@/lib/auth';
import type { Template, TemplateAggregationResult } from '@/types/template';

export const GET = asyncHandler(async (request: NextRequest) => {
    // const session = await getServerSession(authOptions);
    // if (!session?.user?.id) throw APIError.unauthorized('Authentication required');

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '0');
    const skip = limit > 0 ? (page - 1) * limit : 0;

    const result = await TemplateModel.aggregate<TemplateAggregationResult>([
        { $match: { createdBy: new mongoose.Types.ObjectId('68b023e4ac16b4f7ace35abb') } },
        {
            $facet: {
                templates: [
                    { $sort: { createdAt: -1 } },
                    ...(limit > 0 ? [{ $skip: skip }, { $limit: limit }] : []),
                    {
                        $addFields: {
                            id: { $toString: '$_id' },
                            variables: {
                                $map: {
                                    input: '$variables',
                                    as: 'variable',
                                    in: {
                                        $mergeObjects: [
                                            '$$variable',
                                            { id: { $toString: '$$variable._id' } }
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    {
                        $unset: ['_id', 'variables._id']
                    }
                ],
                totalCount: [{ $count: 'count' }]
            }
        }
    ]);

    const templates = result[0].templates;
    const total = result[0].totalCount[0]?.count || 0;

    return apiResponse.success({
        templates,
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

    const { name, description, svgTemplate, variables }: Template = await request.json();

    if (!name || !svgTemplate || !variables) {
        throw APIError.validation('Missing required fields: name, svgTemplate, variables');
    }

    const template: ITemplate = new TemplateModel({
        name,
        description,
        svgTemplate,
        variables,
        createdBy: session.user.id
    });

    await template.save();

    return apiResponse.success({
        id: template._id,
        compilationStatus: template.blockchain.compilationStatus
    }, 'Template created successfully');
});
