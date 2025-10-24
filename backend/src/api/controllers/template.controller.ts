import { Request } from "express";
import { asyncHandler } from "@api/response";
import { AuthenticatedRequest } from "@type/request.type";
import { validateRequest } from "@middlewares/validation";
import validateAuth from "@middlewares/auth";
import {
    CreateTemplateSchema,
    UpdateTemplateSchema,
    TemplateIdSchema,
    TemplateQueryOptionsSchema
} from "@type/template.type";
import { TemplateService } from "@services/template.service";

export default class TemplateController {
    // POST /api/templates
    static createTemplate = [
        validateAuth,
        validateRequest(CreateTemplateSchema),
        asyncHandler(async (req: Request) => {
            const authenticatedReq = req as AuthenticatedRequest;
            const result = await TemplateService.createTemplate({
                ...req.body,
                createdBy: authenticatedReq.user.id
            });
            return { data: result.template, message: result.message };
        })
    ];

    // PUT /api/templates/:id
    static updateTemplate = [
        validateAuth,
        validateRequest(UpdateTemplateSchema),
        asyncHandler(async (req: Request) => {
            const { id } = req.params;
            const authenticatedReq = req as AuthenticatedRequest;
            const result = await TemplateService.updateTemplate({
                id,
                updates: req.body,
                ownerId: authenticatedReq.user.id
            });
            return { data: result.template, message: result.message };
        })
    ];

    // DELETE /api/templates/:id
    static deleteTemplate = [
        validateAuth,
        validateRequest(TemplateIdSchema),
        asyncHandler(async (req: Request) => {
            const { id } = req.params;
            const authenticatedReq = req as AuthenticatedRequest;
            const result = await TemplateService.deleteTemplate(
                { id, ownerId: authenticatedReq.user.id }
            );
            return { data: null, message: result.message };
        })
    ];

    // GET /api/templates/:id
    static getTemplateById = [
        validateAuth,
        validateRequest(TemplateIdSchema),
        asyncHandler(async (req: Request) => {
            const { id } = req.params;
            const result = await TemplateService.getTemplateById(id);
            return { data: result.template, message: result.message };
        })
    ];

    // GET /api/templates
    static getAllTemplates = [
        validateAuth,
        validateRequest(TemplateQueryOptionsSchema),
        asyncHandler(async (req: Request) => {
            const authenticatedReq = req as AuthenticatedRequest;
            const result = await TemplateService.getAllTemplates({
                options: req.query,
                createdBy: authenticatedReq.user.id
            });

            return { data: result.data, message: result.message };
        })
    ];
}