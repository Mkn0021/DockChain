"use client";

import { useState, useEffect } from 'react';
import InputBox from '@/components/InputBox';
import { Template } from '@/types/template.type';
import InfoBox from '@/app/dashboard/(components)/InfoBox';
import { useStepper } from '@/app/dashboard/(components)/StepperLayout';
import { ISSUING_INSTRACTIONS } from '../(data)';

interface ReviewStepProps {
    selectedTemplate: Template;
    formValues: Record<string, string>;
    renderedDocument: string | null;
    onRenderedDocumentChange: (svg: string | null) => void;
}

export default function ReviewStep({
    selectedTemplate,
    formValues,
    renderedDocument,
    onRenderedDocumentChange
}: ReviewStepProps) {
    const [recipient, setRecipient] = useState<string>('');
    const [isRendering, setIsRendering] = useState<boolean>(false);
    const { setCanGoToNextStep, setOnNext } = useStepper();

    useEffect(() => {
        const handleDocumentIssue = async () => {
            try {
                return true;
            } catch (error) {
                console.error(`Document issue failed: ${error}`, 'error')
                return false;
            }
        }

        setOnNext(() => handleDocumentIssue)
    }, [setOnNext, recipient])

    useEffect(() => {
        setCanGoToNextStep(!!recipient.trim() && !!renderedDocument);
    }, [renderedDocument, recipient, setCanGoToNextStep]);

    useEffect(() => {
        const renderDocument = async () => {
            if (selectedTemplate) {
                setIsRendering(true);
                try {

                } catch (error) {
                    console.error(`Error rendering document: ${error}`, 'error');
                    onRenderedDocumentChange(null);
                } finally {
                    setIsRendering(false);
                }
            }
        };
        renderDocument();
    }, [selectedTemplate, formValues, onRenderedDocumentChange]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full items-start">
            <div className="flex items-center justify-center w-full h-full">
                <div className="w-96 h-72 border rounded-lg p-2 bg-background-muted shadow-md mx-auto flex items-center justify-center">
                    {isRendering ? (
                        <p>Rendering document...</p>
                    ) : renderedDocument ? (
                        <div className="[&_svg]:rounded-lg [&_svg]:max-w-full [&_svg]:max-h-full [&_svg]:w-auto [&_svg]:h-auto" dangerouslySetInnerHTML={{ __html: renderedDocument }} />
                    ) : (
                        <p>No document preview available.</p>
                    )}
                </div>
            </div>
            <div className="flex flex-col items-center w-full gap-4">
                <InputBox
                    label="Recipient"
                    placeholder="Enter recipient name or email..."
                    value={recipient}
                    onChange={e => setRecipient(e.target.value)}
                    required
                />
                <InfoBox
                    title="Issuing Information"
                    items={ISSUING_INSTRACTIONS}
                    className="w-full"
                />
            </div>
        </div>
    );
}