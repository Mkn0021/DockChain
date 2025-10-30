"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/_ui/Button';
import { useStepper } from '@/components/dashboard/StepperLayout';
import { Template, TemplateSelectionStepProps } from '@/types/template.type';
import ApiClient from '@/lib/api-client';


export default function SelectionStep({ selectedTemplate, onSelectTemplate }: TemplateSelectionStepProps) {
    const [templates, setTemplates] = useState<Template[]>([]);
    const { setCanGoToNextStep } = useStepper();

    useEffect(() => {
        setCanGoToNextStep(!!selectedTemplate);
    }, [selectedTemplate, setCanGoToNextStep]);

    useEffect(() => {
        async function fetchTemplates() {
            try {
                const response = await ApiClient.get('/templates/');

                if (!response.success) {
                    throw new Error(response.error || 'Failed to fetch templates');
                }
                // TODO: Add pagination support later
                const data = response.data as { templates: Template[] };
                setTemplates(data.templates);
            } catch (error) {
                console.error(`Error fetching templates: ${error}`, 'error');
            }
        }
        fetchTemplates();
    }, []);

    return (
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
                                <Button onClick={() => onSelectTemplate(template)}>Use This</Button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}