"use client";

import { useState, useEffect } from 'react';
import { Template } from '@/types/template';
import type { Document } from '@/types/document';
import { Button } from '@/components/ui/Button';
import FormInput from '@/components/ui/FormInput';
import InfoBox from '@/components/dashboard/InfoBox';
import { useAlert } from "@/components/providers/AlertProvider";
import { useStepper } from '../StepperLayout';

interface ReviewStepProps {
    selectedTemplate: Template;
    formValues: Record<string, string>;
    onIssueComplete: () => void;
    renderedDocument: string | null;
    onRenderedDocumentChange: (svg: string | null) => void;
}

export default function ReviewStep({
    selectedTemplate,
    formValues,
    onIssueComplete,
    renderedDocument,
    onRenderedDocumentChange
}: ReviewStepProps) {
    const issuingInfoPoints = [
        "Review the rendered document before issuing.",
        "To edit any value, go to the previous step and update the fields."
    ];

    const [recipient, setRecipient] = useState<string>('');
    const [isRendering, setIsRendering] = useState<boolean>(false);
    const [isIssuing, setIsIssuing] = useState<boolean>(false);
    const { showAlert } = useAlert();
    const { setCanGoToNextStep } = useStepper();

    useEffect(() => {
        setCanGoToNextStep(!!recipient && !!renderedDocument);
    }, [renderedDocument, setCanGoToNextStep]);

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

    const handleDocumentIssue = async () => {
        setIsIssuing(true);
        setCanGoToNextStep(false);
        try {
            const documentData: Partial<Document> = {
                templateId: selectedTemplate!.id,
                issuedTo: {
                    name: recipient,
                },
                data: formValues,
                fileName: `${recipient.toLowerCase()}_${selectedTemplate?.name}_${Date.now()}.svg`
            }

            const res = await fetch('/api/documents', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(documentData)
            });
            if (!res.ok) {
                showAlert('Failed to issue document', 'error');
                setCanGoToNextStep(false);
                return;
            } else {
                showAlert('Document issued successfully!', 'success');
                setCanGoToNextStep(true);
                onIssueComplete();
            }
        } catch (error) {
            showAlert(`Failed to issue document : ${error}`, 'error');
        } finally {
            setIsIssuing(false);
        }
    }

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
                <Button onClick={handleDocumentIssue} disabled={isIssuing || !recipient.trim()} className="w-full">
                    {isIssuing ? 'Issuing...' : 'Issue Document'}
                </Button>
            </div>
        </div>
    );
}