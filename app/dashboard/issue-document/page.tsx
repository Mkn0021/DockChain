"use client";

import { useEffect, useState } from 'react';
import Stepper from "@/components/dashboard/StepperLayout";
import { Button } from '@/components/ui/Button';
import { Template } from '@/types/template';
import { useAlert } from "@/components/providers/AlertProvider";

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
    const [templates, setTemplates] = useState<Template[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
    const { showAlert } = useAlert();

    useEffect(() => {
        async function fetchTemplates() {
            try {
                const res = await fetch('/api/templates');
                if (!res.ok) throw new Error('Failed to fetch templates');
                const response = await res.json();
                setTemplates(response.data?.templates || []);
            } catch (error) {
                showAlert(`Error fetching templates: ${error}`, 'error');
            }
        }
        fetchTemplates();
    }, []);
    return (
        <Stepper steps={IssueDocumentSteps} current={currentStep} setCurrent={setCurrentStep}>
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
                <div className="mt-8">
                    <h3 className="text-lg font-medium mb-2">Fill Required Fields</h3>
                    <p>Form fields content goes here.</p>
                </div>
            )}
            {currentStep === 2 && (
                <div className="mt-8">
                    <h3 className="text-lg font-medium mb-2">Review All Details</h3>
                    <p>Review details content goes here.</p>
                </div>
            )}
            {currentStep === 3 && (
                <div className="mt-8">
                    <h3 className="text-lg font-medium mb-2">Issue Document</h3>
                    <Button>Issue Now</Button>
                </div>
            )}
        </Stepper>
    );
}
