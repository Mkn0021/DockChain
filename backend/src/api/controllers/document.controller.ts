import { Request } from "express";
import { asyncHandler } from "@api/response";
import { AuthenticatedRequest } from "@type/request.type";
import { validateRequest } from "@middlewares/validation";
import { DocumentService } from "@services/document.service";
import { validateAuth, validateVerified } from "@middlewares/auth";
import { issueDocumentSchema, documentIdSchema, verifyDocumentSchema, documentQuerySchema } from "@type/document.type";

export default class DocumentController {
    // POST /api/documents/issue
    static issueDocument = [
        validateAuth,
        validateVerified,
        validateRequest(issueDocumentSchema),
        asyncHandler(async (req: Request) => {
            const authenticatedReq = req as AuthenticatedRequest;
            const result = await DocumentService.issue({
                ...req.body,
                issuerId: authenticatedReq.user.id
            });
            return { data: result.document, message: result.message };
        })
    ];

    // POST /api/documents/:id/revoke
    static revokeDocument = [
        validateAuth,
        validateVerified,
        validateRequest(documentIdSchema),
        asyncHandler(async (req: Request) => {
            const { id } = req.params;
            const authenticatedReq = req as AuthenticatedRequest;
            const result = await DocumentService.revoke({
                id,
                ownerId: authenticatedReq.user.id
            });
            return { data: result.document, message: result.message };
        })
    ];

    // GET /api/documents/:id
    static getDocumentById = [
        validateAuth,
        validateVerified,
        validateRequest(documentIdSchema),
        asyncHandler(async (req: Request) => {
            const { id } = req.params;
            const result = await DocumentService.getById(id);
            return { data: result.document, message: result.message };
        })
    ];

    // POST /api/documents/verify
    static verifyDocument = [
        validateRequest(verifyDocumentSchema),
        asyncHandler(async (req: Request) => {
            const result = await DocumentService.verify(req.body);
            return { data: result.data, message: result.message };
        })
    ];

    // GET /api/documents/:id/qr
    static generateQrCode = [
        validateAuth,
        validateVerified,
        validateRequest(documentIdSchema),
        asyncHandler(async (req: Request) => {
            const { id } = req.params;
            const result = await DocumentService.generateQrCode(id);
            return { data: result.qrCodeDataURL, message: result.message };
        })
    ];

    // GET /api/documents
    static getAllDocuments = [
        validateAuth,
        validateVerified,
        validateRequest(documentQuerySchema),
        asyncHandler(async (req: Request) => {
            const authenticatedReq = req as AuthenticatedRequest;
            const result = await DocumentService.getAllDocuments({
                options: req.query,
                createdBy: authenticatedReq.user.id
            });

            return { data: result.data, message: result.message };
        })
    ];
}