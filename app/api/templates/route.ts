import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { asyncHandler, apiResponse } from '@/lib/api/response';
import { APIError } from '@/lib/api/errors';
import TemplateModel, { ITemplate } from '@/models/Template';
import { authOptions } from '@/lib/auth';
import type { Template, TemplateAggregationResult } from '@/types/template';

export const GET = asyncHandler(async (request: NextRequest) => {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) throw APIError.unauthorized('Authentication required');

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const result = await TemplateModel.aggregate([
        { $match: { createdBy: session.user.id } },
        {
            $facet: {
                templates: [
                    { $sort: { createdAt: -1 } },
                    { $skip: skip },
                    { $limit: limit }
                ],
                totalCount: [{ $count: 'count' }]
            }
        }
    ]) as [TemplateAggregationResult];

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
