import { getServerSession } from 'next-auth';
import mongoose from 'mongoose';
import { authOptions } from '@/lib/auth';
import TemplateModel from '@/models/Template';
import DocumentModel from '@/models/Document';
import { apiResponse, asyncHandler } from '@/lib/api/response';
import { APIError } from '@/lib/api/errors';
import dbConnect, { isMongoConnected } from '@/lib/mongodb';

export type DashboardStats = {
    templates: number;
    documents: number;
    status: string;
};

export const GET = asyncHandler(async () => {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) throw APIError.unauthorized('Authentication required');

    await dbConnect();

    const status = isMongoConnected() ? 'Connected' : 'Disconnected';

    const [templateAgg, documentAgg]: [{ count?: number }[], { count?: number }[]] = await Promise.all([
        TemplateModel.aggregate([
            { $match: { createdBy: new mongoose.Types.ObjectId(session.user.id) } },
            { $count: 'count' }
        ]),
        DocumentModel.aggregate([
            { $match: { createdBy: new mongoose.Types.ObjectId(session.user.id) } },
            { $count: 'count' }
        ])
    ]);
    const templates = templateAgg[0]?.count || 0;
    const documents = documentAgg[0]?.count || 0;

    const stats: DashboardStats = { templates, documents, status };
    return apiResponse.success(stats);
});
