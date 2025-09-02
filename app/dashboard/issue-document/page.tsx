"use client";

import { useState } from 'react';
import { Template } from '@/types/template';
import Stepper from "@/components/dashboard/StepperLayout";
import TemplateSelectionStep from '@/components/dashboard/issue-document/TemplateSelectionStep';
import FillFieldsStep from '@/components/dashboard/issue-document/FillFieldsStep';
import ReviewStep from '@/components/dashboard/issue-document/ReviewStep';
import SuccessStep from '@/components/dashboard/issue-document/SuccessStep';

export default function IssueDocumentPage() {
    const IssueDocumentSteps = [
        {
            title: "Select Design",
            description: "Choose a template design for your document."
        },
        {
            title: "Fill Required Fields",
            description: "Enter all necessary information for the document."
        },
        {
            title: "Review All Details",
            description: "Check and confirm all entered details before issuing."
        },
        {
            title: "Issue Document",
            description: "Finalize and issue your document."
        }];
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
    const [formValues, setFormValues] = useState<Record<string, string>>({});
    const [renderedDocument, setRenderedDocument] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const canGoToNextStep = (() => {
        if (currentStep === 0) {
            return selectedTemplate !== null;
        }
        if (currentStep === 1 && selectedTemplate) {
            return selectedTemplate.variables
                .filter((field) => field.required)
                .every((field) => formValues[field.key]?.trim());
        }
        return true;
    })();

    const handleSetCurrentStep = (step: number) => {
        if (step > currentStep && !canGoToNextStep) return;
        setCurrentStep(step);
    };

    return (
        <Stepper
            steps={IssueDocumentSteps}
            current={currentStep}
            setCurrent={handleSetCurrentStep}
            canGoToNextStep={currentStep === 2 ? false : canGoToNextStep}
        >
            {currentStep === 0 && (
                <TemplateSelectionStep
                    selectedTemplate={selectedTemplate}
                    onSelectTemplate={setSelectedTemplate}
                />
            )}
            {currentStep === 1 && (
                <FillFieldsStep
                    selectedTemplate={selectedTemplate}
                    formValues={formValues}
                    onInputChange={handleInputChange}
                />
            )}
            {currentStep === 2 && (
                <ReviewStep
                    selectedTemplate={selectedTemplate}
                    formValues={formValues}
                    onIssueComplete={() => setCurrentStep(3)}
                    renderedDocument={renderedDocument}
                    onRenderedDocumentChange={setRenderedDocument}
                />
            )}
            {currentStep === 3 && (
                <SuccessStep
                    selectedTemplateId={selectedTemplate ? selectedTemplate.id : ''}
                    renderedDocument={renderedDocument}
                    onNewDocument={() => {
                        setSelectedTemplate(null);
                        setFormValues({});
                        setCurrentStep(0);
                    }}
                />
            )}
        </Stepper>
    );
}
