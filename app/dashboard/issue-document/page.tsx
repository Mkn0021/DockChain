"use client";

import { useState } from 'react';
import { Template } from '@/types/template';
import StepperLayout, { StepperProvider } from "@/components/dashboard/StepperLayout";
import TemplateSelectionStep from '@/components/dashboard/issue-document/TemplateSelectionStep';
import FillFieldsStep from '@/components/dashboard/issue-document/FillFieldsStep';
import ReviewStep from '@/components/dashboard/issue-document/ReviewStep';
import SuccessStep from '@/components/dashboard/issue-document/SuccessStep';

export default function IssueDocumentPage() {
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
    const [formValues, setFormValues] = useState<Record<string, string>>({});
    const [renderedDocument, setRenderedDocument] = useState<string | null>(null);

    const IssueDocumentSteps = [
        {
            title: "Select Design",
            description: "Choose a template design for your document.",
            component: (
                <TemplateSelectionStep
                    selectedTemplate={selectedTemplate}
                    onSelectTemplate={setSelectedTemplate}
                />
            )
        },
        {
            title: "Fill Required Fields",
            description: "Enter all necessary information for the document.",
            component: (
                <FillFieldsStep
                    selectedTemplate={selectedTemplate!}
                    formValues={formValues}
                    onInputChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setFormValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
                    }}
                />
            )
        },
        {
            title: "Review All Details",
            description: "Check and confirm all entered details before issuing.",
            component: (
                <ReviewStep
                    selectedTemplate={selectedTemplate!}
                    formValues={formValues}
                    onIssueComplete={() => setCurrentStep(3)}
                    renderedDocument={renderedDocument}
                    onRenderedDocumentChange={setRenderedDocument}
                />
            )
        },
        {
            title: "Issue Document",
            description: "Finalize and issue your document.",
            component: (
                <SuccessStep
                    selectedTemplateId={selectedTemplate ? selectedTemplate.id : ''}
                    renderedDocument={renderedDocument}
                    onNewDocument={() => {
                        setSelectedTemplate(null);
                        setFormValues({});
                        setCurrentStep(0);
                    }}
                />
            )
        }
    ];

    return (
        <StepperProvider>
            <StepperLayout steps={IssueDocumentSteps} current={currentStep} setCurrent={setCurrentStep}>
                {IssueDocumentSteps[currentStep].component}
            </StepperLayout>
        </StepperProvider>
    );
}
