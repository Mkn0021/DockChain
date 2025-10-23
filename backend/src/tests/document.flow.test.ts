import request from 'supertest';
import { DocumentService } from '../services/document.service';
import APIError from '../api/errors';
import app from '../app';
import { Document } from '../types/document.type';

// Mock the document service
jest.mock('../services/document.service');

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
            isVerified: true
        };
        next();
    }),
    validateVerified: jest.fn((req: any, res: any, next: any) => next())
}));

describe('Document Routes', () => {
    const mockDate = new Date('2025-10-19T04:08:23.752Z');
    const mockDocument: Document = {
        id: '000000000000000000000001',
        templateId: '000000000000000000000002',
        issuerId: '000000000000000000000003',
        fieldValues: {
            testField: 'Test Value'
        },
        recipent: {
            name: 'John Doe',
            email: 'john@example.com'
        },
        blockchain: {
            documentHash: '0x1234567890',
            txHash: '0x0987654321',
            contractAddress: '0x1234567890123456789012345678901234567890',
            network: 'testnet'
        },
        status: 'valid',
        issuedAt: mockDate
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/documents/issue', () => {
        it('should issue document successfully with valid data', async () => {
            (DocumentService.issue as jest.Mock).mockResolvedValue({
                document: mockDocument,
                message: 'Document issued successfully'
            });

            const response = await request(app)
                .post('/api/documents/issue')
                .set('Authorization', 'Bearer valid-token')
                .send({
                    templateId: '000000000000000000000002',
                    fieldValues: {
                        testField: 'Test Value'
                    },
                    recipent: {
                        name: 'John Doe',
                        email: 'john@example.com'
                    },
                    issuerId: '000000000000000000000003',
                    issuedAt: mockDate.toISOString()
                });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                success: true,
                data: {
                    ...mockDocument,
                    issuedAt: expect.any(String)
                },
                message: 'Document issued successfully'
            });
        });

        it('should return error when no token is provided', async () => {
            const response = await request(app)
                .post('/api/documents/issue')
                .send({
                    templateId: '000000000000000000000002',
                    fieldValues: {
                        testField: 'Test Value'
                    },
                    recipent: {
                        name: 'John Doe',
                        email: 'john@example.com'
                    }
                });

            expect(response.status).toBe(401);
            expect(response.body).toEqual({
                success: false,
                error: 'No token provided'
            });
        });

        it('should return error when invalid token is provided', async () => {
            const response = await request(app)
                .post('/api/documents/issue')
                .set('Authorization', 'Bearer invalid-token')
                .send({
                    templateId: '000000000000000000000002',
                    fieldValues: {
                        testField: 'Test Value'
                    },
                    recipent: {
                        name: 'John Doe',
                        email: 'john@example.com'
                    }
                });

            expect(response.status).toBe(401);
            expect(response.body).toEqual({
                success: false,
                error: 'Invalid token'
            });
        });
    });

    describe('POST /api/documents/:id/revoke', () => {
        it('should revoke document successfully', async () => {
            (DocumentService.revoke as jest.Mock).mockResolvedValue({
                document: { ...mockDocument, status: 'revoked', revokedAt: new Date() },
                message: 'Document revoked successfully'
            });

            const response = await request(app)
                .post('/api/documents/1/revoke')
                .set('Authorization', 'Bearer valid-token');

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                success: true,
                data: {
                    ...mockDocument,
                    status: 'revoked',
                    revokedAt: expect.any(String),
                    issuedAt: expect.any(String)
                },
                message: 'Document revoked successfully'
            });
        });
    });

    describe('GET /api/documents/:id', () => {
        it('should get document by id successfully', async () => {
            (DocumentService.getById as jest.Mock).mockResolvedValue({
                document: mockDocument,
                message: 'Document retrieved successfully'
            });

            const response = await request(app)
                .get('/api/documents/1')
                .set('Authorization', 'Bearer valid-token');

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                success: true,
                data: {
                    ...mockDocument,
                    issuedAt: expect.any(String)
                },
                message: 'Document retrieved successfully'
            });
        });
    });

    describe('POST /api/documents/verify', () => {
        it('should verify document successfully', async () => {
            const verificationResult = {
                isValid: true,
                issuer: '0x1234567890123456789012345678901234567890',
                issuedAt: mockDate,
                status: 'active'
            };

            (DocumentService.verify as jest.Mock).mockResolvedValue({
                data: verificationResult,
                message: 'Document verification completed successfully'
            });

            const response = await request(app)
                .post('/api/documents/verify')
                .set('Authorization', 'Bearer valid-token')
                .send({
                    templateId: '000000000000000000000002',
                    documentHash: '0x1234567890123456789012345678901234567890123456789012345678901234'
                });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                success: true,
                data: {
                    ...verificationResult,
                    issuedAt: expect.any(String)
                },
                message: 'Document verification completed successfully'
            });
        });
    });

    describe('GET /api/documents/:id/qr', () => {
        it('should generate QR code successfully', async () => {
            const qrCodeData = 'data:image/png;base64,test-qr-code';

            (DocumentService.generateQrCode as jest.Mock).mockResolvedValue({
                qrCodeDataURL: qrCodeData,
                message: 'QR Code generated successfully'
            });

            const response = await request(app)
                .get('/api/documents/1/qr')
                .set('Authorization', 'Bearer valid-token');

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                success: true,
                data: qrCodeData,
                message: 'QR Code generated successfully'
            });
        });
    });

    describe('GET /api/documents', () => {
        it('should get all documents with query params', async () => {
            const mockDocuments: Document[] = [
                mockDocument,
                { ...mockDocument, id: '000000000000000000000002' }
            ];

            (DocumentService.getAllDocuments as jest.Mock).mockResolvedValue({
                data: {
                    documents: mockDocuments,
                    total: 2,
                    pages: 1
                },
                message: 'Documents retrieved successfully with blockchain status'
            });

            const response = await request(app)
                .get('/api/documents')
                .set('Authorization', 'Bearer valid-token')
                .query({ page: 1, limit: 10 });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                success: true,
                data: {
                    documents: mockDocuments.map(doc => ({
                        ...doc,
                        issuedAt: expect.any(String)
                    })),
                    total: 2,
                    pages: 1
                },
                message: 'Documents retrieved successfully with blockchain status'
            });
        });
    });
});