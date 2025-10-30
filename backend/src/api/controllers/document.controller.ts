import { Request } from "express";
import { asyncHandler } from "@api/response";
import { AuthenticatedRequest } from "@type/request.type";
import { validateRequest } from "@middlewares/validation";
import { DocumentService } from "@services/document.service";
import validateAuth from "@middlewares/auth";
import {
    issueDocumentSchema, documentIdSchema, verifyDocumentSchema, documentQuerySchema,
    generatePdfSchema, verifyBulkDocumentSchema, issueBulkDocumentSchema
} from "@type/document.type";

export default class DocumentController {
    // POST /api/documents/issue
    static issueDocument = [
        validateAuth,
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

    // POST /api/documents/issue/bulk
    static issueBulkDocuments = [
        validateAuth,
        validateRequest(issueBulkDocumentSchema),
        asyncHandler(async (req: Request) => {
            const authenticatedReq = req as AuthenticatedRequest;
            const result = await DocumentService.issueBulk({
                ...req.body,
                issuerId: authenticatedReq.user.id
            });
            return { data: result.documents, message: result.message };
        })
    ];

    // POST /api/documents/:id/revoke
    static revokeDocument = [
        validateAuth,
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

    // POST /api/documents/verify/bulk
    static verifyBulkDocuments = [
        validateRequest(verifyBulkDocumentSchema),
        asyncHandler(async (req: Request) => {
            const result = await DocumentService.verifyBulk(req.body);
            return { data: result.data, message: result.message };
        })
    ];

    // GET /api/documents/:id/qr
    static generateQrCode = [
        validateAuth,
        validateRequest(documentIdSchema),
        asyncHandler(async (req: Request) => {
            const { id } = req.params;
            const result = await DocumentService.generateQrCode(id);

            return { data: result.data, message: result.message };
        })
    ];

    // GET /api/documents
    static getAllDocuments = [
        validateAuth,
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

    // POST /api/documents/:id/pdf
    static generatePdf = [
        validateRequest(generatePdfSchema),
        asyncHandler(async (req: Request) => {
            const result = await DocumentService.generatePdf({
                id: req.params.id,
                renderedDocument: req.body.renderedDocument
            });

            return { file: result.file, message: result.message, };
        })
    ];
}