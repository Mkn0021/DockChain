import { NextRequest } from 'next/server';
import { asyncHandler, apiResponse } from '@/lib/api/response';
import { APIError } from '@/lib/api/errors';
import DocumentModel from '@/models/Document';
import type { DocumentApiInput } from '@/types/document';
import TemplateModel, { ITemplate } from '@/models/Template';
import { ContractDeployer } from '@/lib/blockchain/deployer';

export const POST = asyncHandler(async (request: NextRequest) => {
    const { templateId, data }: DocumentApiInput = await request.json();
    if (!templateId || !data) throw APIError.validation('TemplateId and data are required');

    const template: ITemplate | null = await TemplateModel.findById(templateId);
    if (!template) throw APIError.notFound('Template not found');

    const verification = await ContractDeployer.verifyDocument(
        template.blockchain.deployedAddress,
        template.blockchain.abi,
        data
    );

    const renderedSvg = await DocumentModel.renderDocument(templateId, data);

    return apiResponse.success({
        isValid: verification.isValid,
        exists: verification.exists,
        issuer: verification.issuer,
        timestamp: new Date(verification.timestamp * 1000),
        renderedSvg,
        contentType: 'image/svg+xml',
        message: verification.isValid ? 'Document is valid and verified' : 'Document is invalid'
    });
});
