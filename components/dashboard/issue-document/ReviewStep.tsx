"use client";

import { useState, useEffect } from 'react';
import { Template } from '@/types/template';
import type { Document } from '@/types/document';
import { Button } from '@/components/ui/Button';
import FormInput from '@/components/ui/FormInput';
import InfoBox from '@/components/dashboard/InfoBox';
import { useAlert } from "@/components/providers/AlertProvider";
import { useStepper } from '../StepperLayout';
import { APIError } from '@/lib/api/errors';

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
    const issuingInfoPoints = [
        "Review the rendered document before issuing.",
        "To edit any value, go to the previous step and update the fields."
    ];

    const [recipient, setRecipient] = useState<string>('');
    const [isRendering, setIsRendering] = useState<boolean>(false);
    const { showAlert } = useAlert();
    const { setCanGoToNextStep, setOnNext } = useStepper();

    useEffect(() => {
        const handleDocumentIssue = async () => {
            try {
                const documentData: Partial<Document> = {
                    templateId: selectedTemplate.id,
                    issuedTo: {
                        name: recipient,
                    },
                    data: formValues,
                    fileName: `${recipient.toLowerCase()}_${selectedTemplate?.name}_${Date.now()}.svg`
                }

                console.log('Issuing document with data:', documentData);

                const res = await fetch('/api/documents', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(documentData)
                });

                if (!res.ok) {
                    showAlert("Document Issue API response not ok", 'error')
                    return false;
                }

                showAlert('Document issued successfully!', 'success');
                return true;
            } catch (error) {
                showAlert(`Document issue failed: ${error}`, 'error')
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
                    const res = await fetch('/api/documents/render', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            templateId: selectedTemplate.id,
                            data: formValues
                        })
                    });
                    if (!res.ok) throw new Error('Failed to render document');
                    const response: { data: { renderedSvg: string } } = await res.json();
                    onRenderedDocumentChange(response.data.renderedSvg || null);
                } catch (error) {
                    showAlert(`Error rendering document: ${error}`, 'error');
                    onRenderedDocumentChange(null);
                } finally {
                    setIsRendering(false);
                }
            }
        };
        renderDocument();
    }, [selectedTemplate, formValues, showAlert]);

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
                <FormInput
                    label="Recipient"
                    placeholder="Enter recipient name or email..."
                    value={recipient}
                    onChange={e => setRecipient(e.target.value)}
                    required
                />
                <InfoBox
                    title="Issuing Information"
                    items={issuingInfoPoints}
                    className="w-full"
                />
            </div>
        </div>
    );
}