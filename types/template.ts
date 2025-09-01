import { TemplateBlockchainData } from './blockchain';

export interface Template {
    id: string;
    name: string;
    description?: string;
    svgTemplate: string;
    variables: TemplateVariables[];
    createdBy: string;
    blockchain: TemplateBlockchainData;
    createdAt: Date;
    updatedAt: Date;
}

export interface TemplateVariables {
    key: string;
    type: "string" | "date";
    required: boolean;
}

export interface TemplateAggregationResult {
    templates: Template[];
    totalCount: Array<{ count: number }>;
}