import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import TemplateModel from '@/models/Template';
import DocumentModel from '@/models/Document';
import { apiResponse, asyncHandler } from '@/lib/api/response';
import { APIError } from '@/lib/api/errors';
import { isMongoConnected } from '@/lib/mongodb';

export type DashboardStats = {
    templates: number;
    documents: number;
    status: string;
};

export const GET = asyncHandler(async () => {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) throw APIError.unauthorized('Authentication required');

    const [templates, documents] = await Promise.all([
        TemplateModel.countDocuments({ createdBy: session.user.id }),
        DocumentModel.countDocuments({ createdBy: session.user.id })
    ]);

    const stats: DashboardStats = {
        templates,
        documents,
        status: isMongoConnected() ? 'Connected' : 'Disconnected'
    };

    return apiResponse.success(stats);
});
