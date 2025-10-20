import QRCode from "qrcode";
import { env } from "@config/env";
import APIError from "@api/errors";
import { PipelineStage } from "mongoose";
import { BlockchainDocumentService } from "blockchain";
import DocumentModel, { IDocument } from "@model/Document.model";
import TemplateModel, { ITemplate } from "@model/Template.model";
import { IssueDocumentInput, revokeDocumentInput, verifyDocumentInput, DocumentQueryOptions, DocumentAggregationResult } from "@type/document.type";


export class DocumentService {
    private static contractAddress = "";
    private static blockchainCache = new Map<string, BlockchainDocumentService>();

    private static async getBlockchain(templateId: string) {
        if (!this.blockchainCache.has(templateId)) {
            const template: ITemplate | null = await TemplateModel.findById(templateId).lean();
            if (!template) throw new Error("Template not found");

            this.contractAddress = template.blockchain.contractAddress;

            const instance = new BlockchainDocumentService(
                template.blockchain.contractAddress,
                template.blockchain.abi
            );

            this.blockchainCache.set(templateId, instance);
        }

        return this.blockchainCache.get(templateId)!;
    }

    private static async getDocumentOrThrow(id: string): Promise<IDocument> {
        const document: IDocument | null = await DocumentModel.findById(id);
        if (!document) throw APIError.notFound("Document not found");
        return document;
    }

    static async issue(data: IssueDocumentInput) {
        const existingDocument = await DocumentModel.findOne({
            templateId: data.templateId,
            fieldValues: data.fieldValues
        })

        if (existingDocument) {
            throw new Error("Document with the same field values already exists");
        }

        const blockchain = await this.getBlockchain(data.templateId);
        const documentHash = blockchain.generateDocHash(data.fieldValues);
        const txHash = await blockchain.issueDocument({
            docHash: documentHash,
            fields: data.fieldValues,
            gasLimit: 500000
        });

        const document: IDocument = await DocumentModel.create({
            ...data,
            blockchain: {
                documentHash,
                txHash,
                contractAddress: this.contractAddress
            },
            status: "active"
        });

        return {
            document: document.toJSON(),
            message: "Document issued successfully"
        };
    }

    static async revoke({ id, ownerId }: revokeDocumentInput) {
        const document = await this.getDocumentOrThrow(id);

        if (document.status === "revoked") {
            throw APIError.badRequest("Document is already revoked");
        }

        if (document.issuerId.toString() !== ownerId) {
            throw APIError.forbidden("You are not authorized to revoke this document");
        }

        const blockchain = await this.getBlockchain(document.templateId.toString());
        await blockchain.revokeDocument(document.blockchain.documentHash);

        document.status = "revoked";
        document.revokedAt = new Date();
        await document.save();

        return {
            document: document.toJSON(),
            message: "Document revoked successfully"
        };
    }

    static async getById(id: string) {
        const document = await this.getDocumentOrThrow(id);

        return {
            document: document.toJSON(),
            message: "Document retrieved successfully"
        };
    }

    static async verify(data: verifyDocumentInput) {
        const template: ITemplate | null = await TemplateModel.findById(data.templateId).lean();
        if (!template) throw APIError.notFound("Template not found");

        const blockchain = await this.getBlockchain(template._id.toString());
        const varifydata = await blockchain.verifyDocument(data.documentHash);

        return {
            data: varifydata,
            message: "Document verification completed successfully"
        };
    }

    static async generateQrCode(id: string) {
        const document = await this.getDocumentOrThrow(id);
        const url = `${env.BASE_URL}/verify/?templateId=${document.templateId}&docHash=${document.blockchain.documentHash}`;

        return {
            qrCodeDataURL: await QRCode.toDataURL(url),
            message: "QR Code generated successfully"
        };
    }

    static async getAllDocuments({ createdBy, options }: { createdBy: string; options: Partial<DocumentQueryOptions>; }) {
        const page = options.page || 1;
        const limit = options.limit || 10;
        const sort = options.sort || { issuedAt: "-1" };
        const skip = (page - 1) * limit;

        const matchStage: PipelineStage.Match = {
            $match: {
                createdBy,
                ...(options.templateId && { templateId: options.templateId }),
                ...(options.status && { status: options.status }),
                ...(options.issuerId && { issuerId: options.issuerId })
            }
        };

        const sortStage: PipelineStage.Sort = {
            $sort: Object.entries(sort).reduce((acc, [key, value]) => ({
                ...acc,
                [key]: value === 'asc' || value === '1' ? 1 : -1
            }), {})
        };

        const result = await DocumentModel.aggregate<DocumentAggregationResult>([
            matchStage,
            {
                $facet: {
                    documents: [
                        sortStage,
                        ...(limit > 0 ? [{ $skip: skip }, { $limit: limit }] : []),
                        {
                            $addFields: {
                                id: { $toString: '$_id' }
                            }
                        },
                        {
                            $unset: ['_id']
                        }
                    ],
                    totalCount: [{ $count: 'count' }]
                }
            }
        ]);

        const documents = result[0]?.documents || [];
        const total = result[0]?.totalCount[0]?.count || 0;
        const pages = Math.ceil(total / limit);

        return {
            data: {
                documents,
                total,
                pages
            },
            message: "Documents retrieved successfully with blockchain status"
        };
    }
}
