"use client";

import { useState } from 'react';
import { useEffect } from 'react';
import { Template } from '@/types/template';
import { Button } from '@/components/ui/Button';
import { useAlert } from "@/components/providers/AlertProvider";


interface TemplateSelectionStepProps {
    selectedTemplate: Template | null;
    onSelectTemplate: (template: Template) => void;
}

export default function TemplateSelectionStep({ selectedTemplate, onSelectTemplate }: TemplateSelectionStepProps) {
    const [templates, setTemplates] = useState<Template[]>([]);
    const { showAlert } = useAlert();

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
    }, [showAlert]);

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