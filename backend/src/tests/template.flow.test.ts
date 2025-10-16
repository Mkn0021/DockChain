import request from 'supertest';
import { TemplateService } from '../services/template.service';
import APIError from '../api/errors';
import app from '../app';
import { Template } from '../types/template.type';

// Mock the template service
jest.mock('../services/template.service');

// Mock the authentication middlewares
jest.mock('@middlewares/auth', () => ({
    validateAuth: jest.fn((req: any, res: any, next: any) => {
        const authHeader = req.headers.authorization;

        // No token provided
        if (!authHeader) {
            const error = APIError.unauthorized('No token provided');
            return next(error);
        }

        // Invalid token format
        if (!authHeader.startsWith('Bearer ')) {
            const error = APIError.unauthorized('Invalid token format');
            return next(error);
        }

        // Invalid token
        if (authHeader === 'Bearer invalid-token') {
            const error = APIError.unauthorized('Invalid token');
            return next(error);
        }

        // Valid token - set user and proceed
        req.user = {
            id: '1',
            email: 'test@example.com',
            role: 'user',
            isVerified: false
        };
        next();
    }),
    validateVerified: jest.fn((req: any, res: any, next: any) => next())
}));

describe('Template Routes', () => {
    const mockTemplate: Template = {
        id: '1',
        name: 'Test Template',
        description: 'Test Description',
        svgTemplate: '<svg></svg>',
        fields: [{
            key: 'testField',
            type: 'string',
            required: true
        }],
        blockchain: {
            abi: [],
            bytecode: '0x0123',
            contractSource: '',
            compilationStatus: 'success',
            contractAddress: '0x1234567890123456789012345678901234567890',
            deployedAddress: '0x1234567890123456789012345678901234567890'
        },
        createdBy: '1',
        createdAt: new Date(),
        updatedAt: new Date()
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/templates', () => {
        it('should create template successfully with valid data', async () => {
            (TemplateService.createTemplate as jest.Mock).mockResolvedValue({
                template: mockTemplate,
                message: 'Template created successfully'
            });

            const response = await request(app)
                .post('/api/templates')
                .set('Authorization', 'Bearer valid-token')
                .send({
                    name: 'Test Template',
                    description: 'Test Description',
                    svgTemplate: '<svg></svg>',
                    fields: [{
                        key: 'testField',
                        type: 'string',
                        required: true
                    }],
                    createdBy: '1'
                });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                success: true,
                data: {
                    ...mockTemplate,
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String)
                },
                message: 'Template created successfully'
            });
        });

        it('should return 401 when no token is provided', async () => {
            const response = await request(app)
                .post('/api/templates')
                .send({
                    name: 'Test Template'
                });

            expect(response.status).toBe(401);
        });

        it('should return 400 for invalid template data', async () => {
            const response = await request(app)
                .post('/api/templates')
                .set('Authorization', 'Bearer valid-token')
                .send({
                    // Missing required fields
                    description: 'Test Description'
                });

            expect(response.status).toBe(400);
        });
    });

    describe('GET /api/templates', () => {
        it('should return list of templates with pagination', async () => {
            const mockTemplateList = {
                data: {
                    templates: [mockTemplate],
                    total: 1,
                    pages: 1
                },
                message: 'Templates retrieved successfully'
            };

            (TemplateService.getAllTemplates as jest.Mock).mockResolvedValue(mockTemplateList);

            const response = await request(app)
                .get('/api/templates')
                .set('Authorization', 'Bearer valid-token')
                .query({ page: 1, limit: 10 });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                success: true,
                data: {
                    templates: [{
                        ...mockTemplate,
                        createdAt: expect.any(String),
                        updatedAt: expect.any(String)
                    }],
                    total: 1,
                    pages: 1
                },
                message: 'Templates retrieved successfully'
            });
        });

        it('should filter templates by name', async () => {
            const mockTemplateList = {
                templates: [mockTemplate],
                total: 1,
                page: 1,
                pages: 1,
                message: 'Templates retrieved successfully'
            };

            (TemplateService.getAllTemplates as jest.Mock).mockResolvedValue(mockTemplateList);

            const response = await request(app)
                .get('/api/templates')
                .set('Authorization', 'Bearer valid-token')
                .query({ name: 'Test' });

            expect(response.status).toBe(200);
            expect(TemplateService.getAllTemplates).toHaveBeenCalledWith({
                createdBy: '1',
                options: { name: 'Test' }
            });
        });
    });

    describe('GET /api/templates/:id', () => {
        it('should return template by id', async () => {
            (TemplateService.getTemplateById as jest.Mock).mockResolvedValue({
                template: mockTemplate,
                message: 'Template retrieved successfully'
            });

            const response = await request(app)
                .get('/api/templates/1')
                .set('Authorization', 'Bearer valid-token');

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                success: true,
                data: {
                    ...mockTemplate,
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String)
                },
                message: 'Template retrieved successfully'
            });
        });

        it('should return 404 for non-existent template', async () => {
            (TemplateService.getTemplateById as jest.Mock).mockRejectedValue(
                APIError.notFound('Template not found')
            );

            const response = await request(app)
                .get('/api/templates/999')
                .set('Authorization', 'Bearer valid-token');

            expect(response.status).toBe(404);
        });
    });

    describe('PUT /api/templates/:id', () => {
        it('should update template successfully', async () => {
            const updatedTemplate = { ...mockTemplate, name: 'Updated Template' };
            (TemplateService.updateTemplate as jest.Mock).mockResolvedValue({
                template: updatedTemplate,
                message: 'Template updated successfully'
            });

            const response = await request(app)
                .put('/api/templates/1')
                .set('Authorization', 'Bearer valid-token')
                .send({
                    name: 'Updated Template'
                });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                success: true,
                data: {
                    ...updatedTemplate,
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String)
                },
                message: 'Template updated successfully'
            });
        });

        it('should return 403 when updating template owned by another user', async () => {
            (TemplateService.updateTemplate as jest.Mock).mockRejectedValue(
                APIError.forbidden("You don't have permission to update this template")
            );

            const response = await request(app)
                .put('/api/templates/1')
                .set('Authorization', 'Bearer valid-token')
                .send({
                    name: 'Updated Template'
                });

            expect(response.status).toBe(403);
            expect(TemplateService.updateTemplate).toHaveBeenCalledWith({
                id: '1',
                updates: { name: 'Updated Template' },
                ownerId: '1'
            });
        });
    });

    describe('DELETE /api/templates/:id', () => {
        it('should delete template successfully', async () => {
            (TemplateService.deleteTemplate as jest.Mock).mockResolvedValue({
                message: 'Template deleted successfully'
            });

            const response = await request(app)
                .delete('/api/templates/1')
                .set('Authorization', 'Bearer valid-token');

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                success: true,
                data: null,
                message: 'Template deleted successfully'
            });
            expect(TemplateService.deleteTemplate).toHaveBeenCalledWith({ id: '1', ownerId: '1' });
        });

        it('should return 403 when deleting template owned by another user', async () => {
            (TemplateService.deleteTemplate as jest.Mock).mockRejectedValue(
                APIError.forbidden("You don't have permission to delete this template")
            );

            const response = await request(app)
                .delete('/api/templates/1')
                .set('Authorization', 'Bearer valid-token');

            expect(response.status).toBe(403);
            expect(TemplateService.deleteTemplate).toHaveBeenCalledWith({ id: '1', ownerId: '1' });
        });
    });
});