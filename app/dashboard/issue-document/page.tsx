"use client";

import { useEffect, useState } from 'react';
import Stepper from "@/components/dashboard/StepperLayout";
import { Button } from '@/components/ui/Button';
import FormInput from '@/components/ui/FormInput';
import { Template } from '@/types/template';
import { useAlert } from "@/components/providers/AlertProvider";
import type { Document } from '@/types/document';
import InfoBox from '@/components/dashboard/InfoBox';
import { MdVerified } from 'react-icons/md';

export default function IssueDocumentPage() {
    const issuingInfoPoints = [
        "Review the rendered document before issuing.",
        "To edit any value, go to the previous step and update the fields."
    ];
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
    const [templates, setTemplates] = useState<Template[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
    const [formValues, setFormValues] = useState<Record<string, string>>({});
    const [recipient, setRecipient] = useState<string>('');
    const [renderedDocument, setRenderedDocument] = useState<string | null>(null);
    const [isRendering, setIsRendering] = useState<boolean>(false);
    const [isIssuing, setIsIssuing] = useState<boolean>(false);
    const { showAlert } = useAlert();

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

    const handleDocumentIssue = async () => {
        setIsIssuing(true);
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
            } else {
                showAlert('Document issued successfully!', 'success');
            }

            setCurrentStep(3);
        } catch (error) {
            showAlert(`Failed to issue document : ${error}`, 'error');
        } finally {
            setIsIssuing(false);
        }
    }

    function downloadSvgAsPng(svgString: string, templateId: string) {
        try {
            const svgBlob = new Blob([svgString], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(svgBlob);

            const img = new window.Image();
            img.onload = function () {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.drawImage(img, 0, 0);
                    canvas.toBlob((blob) => {
                        if (blob) {
                            // Filename includes templateId as metadata
                            const filename = `document_template_${templateId}.png`;
                            const link = document.createElement('a');
                            link.href = URL.createObjectURL(blob);
                            link.download = filename;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                        }
                    }, 'image/png');
                }
                URL.revokeObjectURL(url);
            };
            img.src = url;
        } catch (error) {
            showAlert(`Error downloading PNG: ${error}`, 'error');
        }
    }

    useEffect(() => {
        async function fetchTemplates() {
            try {
                const res = await fetch('/api/templates');
                if (!res.ok) throw new Error('Failed to fetch templates');
                const response: { data: { templates: Template[] } } = await res.json();
                setTemplates(response.data.templates || []);
            } catch (error) {
                showAlert(`Error fetching templates: ${error}`, 'error');
            }
        }
        fetchTemplates();
    }, []);

    useEffect(() => {
        const renderDocument = async () => {
            if (currentStep === 2 && selectedTemplate) {
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
                    setRenderedDocument(response.data.renderedSvg || null);
                } catch (error) {
                    showAlert(`Error rendering document: ${error}`, 'error');
                    setRenderedDocument(null);
                } finally {
                    setIsRendering(false);
                }
            }
        };
        renderDocument();
    }, [currentStep]);
    return (
        <Stepper
            steps={IssueDocumentSteps}
            current={currentStep}
            setCurrent={handleSetCurrentStep}
            canGoToNextStep={currentStep === 2 ? false : canGoToNextStep}
        >
            {currentStep === 0 && (
                <div className="w-full h-72 rounded-none overflow-x-auto overflow-y-hidden">
                    <div className="h-full flex flex-nowrap gap-6 items-center py-2">
                        {templates.length === 0 ? (
                            <div className="flex flex-col items-center justify-center w-full h-full text-center">
                                <h4 className='m-0 p-0'>No templates available.</h4>
                                <p>Please upload a template to get started.</p>
                            </div>
                        ) : (
                            templates.map((template) => (
                                <div key={template.id} className={`w-96 h-full flex flex-col bg-background-muted p-2 border border-border rounded-lg shadow-md group relative overflow-hidden transition-all duration-300 ${selectedTemplate?.id === template.id ? 'border-2 border-primary' : ''}`}>
                                    <div className="group-hover:hidden w-full flex items-center justify-center overflow-hidden rounded-lg transition-all duration-100 group-hover:opacity-0 group-hover:pointer-events-none [&_svg]:rounded-lg [&_svg]:max-w-full [&_svg]:max-h-full [&_svg]:w-auto [&_svg]:h-auto"
                                        dangerouslySetInnerHTML={{ __html: template.svgTemplate }}
                                    />
                                    <div className="hidden group-hover:flex flex-col items-center justify-center h-full w-full text-center gap-4">
                                        <div>
                                            <h4 className="m-0 p-0"> {template.name}</h4>
                                            <p>{template.description || 'No description provided.'}</p>
                                        </div>
                                        <Button onClick={() => setSelectedTemplate(template)}>Use This</Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
            {currentStep === 1 && (
                <div className="w-full max-w-3xl">
                    <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {selectedTemplate && selectedTemplate.variables.map((field) => {
                            const formattedKey = field.key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                            return (
                                <FormInput
                                    className='w-full max-h-12'
                                    key={field.key}
                                    label={formattedKey}
                                    id={field.key}
                                    name={field.key}
                                    required={field.required}
                                    type={field.type === 'date' ? 'date' : 'text'}
                                    placeholder={`Enter ${formattedKey}`}
                                    value={formValues[field.key] || ''}
                                    onChange={handleInputChange}
                                />
                            );
                        })}
                    </form>
                </div>
            )}
            {currentStep === 2 && (
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
            )}
            {currentStep === 3 && (
                <div className="flex flex-col items-center justify-center w-full max-w-lg text-center gap-2">
                    <MdVerified size={96} className="text-blue-700 mb-2" />
                    <h4 className="text-primary m-0 p-0">Document Issued!</h4>
                    <p>Your document has been issued successfully.The issued document is securely stored and can be verified on the blockchain.</p>
                    <div className="flex w-full justify-center items-center py-6">
                        <Button
                            onClick={() =>
                                renderedDocument && selectedTemplate &&
                                downloadSvgAsPng(renderedDocument, selectedTemplate.id)
                            }
                        >
                            Download Document
                        </Button>
                        <Button variant="secondary"
                            onClick={() => setCurrentStep(0)}
                        >
                            Issue Another Document
                        </Button>
                    </div>
                </div>
            )}
        </Stepper>
    );
}
