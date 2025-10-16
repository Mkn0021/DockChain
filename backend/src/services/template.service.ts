import APIError from "@api/errors";
import { PipelineStage } from "mongoose";
import TemplateModel, { ITemplate } from "@model/Template.model";
import {
    CreateTemplateData, Template, UpdateTemplateData,
    TemplateQueryOptions, TemplateAggregationResult
} from "@type/template.type";

export class TemplateService {
    private static validateTemplate(template: ITemplate | null): asserts template is ITemplate {
        if (!template) throw APIError.notFound("Template not found");
    }

    static async createTemplate(data: CreateTemplateData) {
        const existingTemplate = await TemplateModel.findOne({
            name: data.name,
            createdBy: data.createdBy
        });

        if (existingTemplate) APIError.badRequest("Template with this name already exists");

        const template: ITemplate = await TemplateModel.create({
            ...data,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        return {
            template: template.toJSON(),
            message: "Template created successfully"
        };
    }

    static async updateTemplate(id: string, updates: UpdateTemplateData): Promise<{ template: Template; message: string }> {
        if (updates.name) {
            const duplicateTemplate = await TemplateModel.findOne({
                name: updates.name,
                _id: { $ne: id }
            });
            if (duplicateTemplate) {
                throw APIError.badRequest("Template with this name already exists");
            }
        }

        const existingTemplate: ITemplate | null = await TemplateModel.findByIdAndUpdate(
            id,
            {
                ...updates,
                updatedAt: new Date()
            },
            { new: true, runValidators: true }
        );

        this.validateTemplate(existingTemplate);

        return {
            template: existingTemplate.toJSON(),
            message: "Template updated successfully"
        };
    }

    static async deleteTemplate(id: string): Promise<{ message: string }> {
        const existingTemplate = await TemplateModel.findById(id);
        this.validateTemplate(existingTemplate);

        await TemplateModel.findByIdAndDelete(id);

        return { message: "Template deleted successfully" };
    }

    static async getTemplateById(id: string): Promise<{ template: Template; message: string }> {
        const template: ITemplate | null = await TemplateModel.findById(id);
        this.validateTemplate(template);

        return {
            template: template.toJSON(),
            message: "Template retrieved successfully"
        };
    }

    static async getAllTemplates({ createdBy, options }: { createdBy: string; options: Partial<TemplateQueryOptions>; }) {
        const page = options.page || 1;
        const limit = options.limit || 10;
        const sort = options.sort || { createdAt: "-1" };
        const skip = (page - 1) * limit;

        const matchStage: PipelineStage.Match = {
            $match: {
                createdBy,
                ...(options.name && { name: { $regex: options.name, $options: 'i' } })
            }
        };

        const sortStage: PipelineStage.Sort = {
            $sort: Object.entries(sort).reduce((acc, [key, value]) => ({
                ...acc,
                [key]: value === 'asc' || value === '1' ? 1 : -1
            }), {})
        };

        const result = await TemplateModel.aggregate<TemplateAggregationResult>([
            matchStage,
            {
                $facet: {
                    templates: [
                        sortStage,
                        ...(limit > 0 ? [{ $skip: skip }, { $limit: limit }] : []),
                        {
                            $addFields: {
                                id: { $toString: '$_id' },
                                fields: {
                                    $map: {
                                        input: '$fields',
                                        as: 'field',
                                        in: {
                                            $mergeObjects: [
                                                '$$field',
                                                { id: { $toString: '$$field._id' } }
                                            ]
                                        }
                                    }
                                }
                            }
                        },
                        {
                            $unset: ['_id', 'fields._id']
                        }
                    ],
                    totalCount: [{ $count: 'count' }]
                }
            }
        ]);

        const templates = result[0]?.templates || [];
        const total = result[0]?.totalCount[0]?.count || 0;
        const pages = Math.ceil(total / limit);

        return {
            data: {
                templates,
                total,
                pages
            },
            message: "Templates retrieved successfully"
        };
    }
}
