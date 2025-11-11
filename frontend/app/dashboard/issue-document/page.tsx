"use client";

import { useState } from "react";
import { Template } from "@/types/template.type";
import StepperLayout, {
    StepperProvider,
} from "@/components/dashboard/StepperLayout";
import SelectionStep from "./(components)/1_SelectionStep";
import FillFieldsStep from "./(components)/2_FillFieldsStep";
import ReviewStep from "./(components)/3_ReviewStep";
import SuccessStep from "./(components)/4_SuccessStep";
import { ISSUE_DOCUMENT_STEPS } from "@/data/dashboard.data";

export default function IssueDocumentPage() {
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
        null
    );
    const [formValues, setFormValues] = useState<Record<string, string>>({});
    const [renderedDocument, setRenderedDocument] = useState<string | null>(
        null
    );
    const [documentId, setDocumentId] = useState<string>("");

    return (
        <StepperProvider>
            <StepperLayout
                steps={ISSUE_DOCUMENT_STEPS}
                current={currentStep}
                setCurrent={setCurrentStep}
            >
                {currentStep === 0 && (
                    <SelectionStep
                        selectedTemplate={selectedTemplate}
                        onSelectTemplate={setSelectedTemplate}
                    />
                )}
                {currentStep === 1 && (
                    <FillFieldsStep
                        selectedTemplate={selectedTemplate!}
                        formValues={formValues}
                        onInputChange={(
                            e: React.ChangeEvent<HTMLInputElement>
                        ) => {
                            setFormValues((prev) => ({
                                ...prev,
                                [e.target.name]: e.target.value,
                            }));
                        }}
                    />
                )}
                {currentStep === 2 && (
                    <ReviewStep
                        selectedTemplate={selectedTemplate!}
                        formValues={formValues}
                        renderedDocument={renderedDocument}
                        onRenderedDocumentChange={setRenderedDocument}
                        onDocumentIssued={setDocumentId}
                    />
                )}
                {currentStep === 3 && (
                    <SuccessStep
                        documentId={documentId}
                        renderedDocument={renderedDocument}
                        onNewDocument={() => {
                            setSelectedTemplate(null);
                            setFormValues({});
                            setCurrentStep(0);
                        }}
                    />
                )}
            </StepperLayout>
        </StepperProvider>
    );
}
