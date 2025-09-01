import { NextRequest } from 'next/server';
import { asyncHandler, apiResponse } from '@/lib/api/response';
import { APIError } from '@/lib/api/errors';
import DocumentModel from '@/models/Document';
import type { DocumentApiInput } from '@/types/document';

export const POST = asyncHandler(async (request: NextRequest) => {
    const { templateId, data }: DocumentApiInput = await request.json();

    if (!templateId || !data) throw APIError.validation('Missing required fields: templateId, data');

    const renderedSvg = await DocumentModel.renderDocument(templateId, data);

    return apiResponse.success({
        renderedSvg,
        contentType: 'image/svg+xml'
    });
});
