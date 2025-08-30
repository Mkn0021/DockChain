"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { IoCloudUploadOutline, IoClose } from "react-icons/io5";
import FormInput from '@/components/ui/FormInput';
import { useAlert } from "@/components/providers/AlertProvider";
import type { Template } from '@/types/template';

export default function UploadTemplatePage() {
    const { showAlert } = useAlert();
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [svgTemplate, setSvgTemplate] = useState<string>('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isDeploying, setIsDeploying] = useState(false);
    const canDeploy = selectedFile && title.trim() !== '';

    const deploymentFeatures = [
        "Use {{field name}} for required fields or variables",
        "Each deployment creates a unique smart contract on the blockchain",
        "Once deployed, templates can be used to issue documents with dynamic data"
    ];

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files![0];
        if (file && file.type === 'image/svg+xml') {
            setSelectedFile(file);

            const reader = new FileReader();
            reader.onload = (e: ProgressEvent<FileReader>) => {
                setSvgTemplate(e.target?.result as string);
            };
            reader.readAsText(file);
        }
    };

    const clearFile = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedFile(null);
        setSvgTemplate('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleDeploy = async () => {
        if (!canDeploy) {
            showAlert('Please upload an SVG file with Title before deploying.', 'error');
            return;
        }
        setIsDeploying(true);
        try {
            const regex = /\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g;
            const matches = [...svgTemplate.matchAll(regex)];
            const requiredFields = matches.map(m => m[1]);
            if (requiredFields.length === 0) {
                showAlert('No required fields (e.g., {{field_name}}) found in SVG', 'error');
                return;
            }

            const newTemplate: Partial<Template> = {
                name: title,
                description,
                svgTemplate,
                variables: requiredFields.map(key => ({
                    key,
                    type: key.toLowerCase().includes('date') ? 'date' : 'string',
                    required: true
                }))
            };

            const response = await fetch('/api/templates', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTemplate)
            });

            if (!response.ok) {
                const errorData = await response.json();
                showAlert(`Deployment failed: ${errorData.message || 'Unknown error'}`, 'error');
                return;
            }

            showAlert('Template deployed successfully to blockchain!', 'success');
            window.location.href = '/dashboard/issue-document';
        } catch (error) {
            showAlert(`Deployment failed: ${error}`, 'error');
        } finally {
            setIsDeploying(false);
        }
    };

    return (
        <main className="w-full">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Left Side: Upload & Preview Box */}
                <div>
                    <div className={`flex flex-col items-center justify-center relative h-96 ${!selectedFile ? 'border-2 border-dashed border-border hover:border-text-muted cursor-pointer' : ''}`}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {!selectedFile ? (
                            <>
                                <IoCloudUploadOutline size={96} className="text-border" />
                                <h4 className='m-0 p-0'>Upload SVG Template</h4>
                                <p className='text-text-secondary'>Click to select an SVG file for preview and upload</p>
                            </>
                        ) : (
                            <div className="w-full flex flex-col items-center gap-4">
                                <button
                                    onClick={clearFile}
                                    className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md"
                                    title="Remove file"
                                >
                                    <IoClose size={20} className="text-text-primary hover:text-red-600 transition-colors" />
                                </button>

                                {/* SVG Preview */}
                                <div className="w-full h-96 border-2 border-border rounded-lg p-2 bg-background-muted shadow-sm overflow-hidden">
                                    <div className="w-full h-full flex items-center justify-center [&_svg]:rounded-lg [&_svg]:max-w-full [&_svg]:max-h-full [&_svg]:w-auto [&_svg]:h-auto"
                                        dangerouslySetInnerHTML={{ __html: svgTemplate }}
                                    />
                                </div>
                            </div>
                        )}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".svg"
                            className="hidden"
                            onChange={handleFileSelect}
                        />
                    </div>
                </div>

                {/* Right Side: Template Information */}
                <div>
                    <div className="space-y-6">
                        <FormInput
                            label="Template Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter a descriptive title for your template..."
                            required
                        />

                        <FormInput
                            label="Template Description"
                            as="textarea"
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Provide a detailed description of your template, its use cases, and features..."
                            required
                        />

                        <div className="bg-blue-50 rounded-lg px-4 py-6 border border-blue-200">
                            <h4 className="text-blue-900 m-0 p-0 mb-2">Deployment Process</h4>
                            <ul className="text-sm text-blue-800 space-y-2">
                                {deploymentFeatures.map((feature, idx) => (
                                    <li key={idx} className="flex items-start space-x-2">
                                        <span className="text-primary">•</span>
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex justify-center mt-6">
                <Button
                    onClick={handleDeploy}
                    disabled={!canDeploy || isDeploying}
                    className="w-72"
                >
                    {isDeploying ? 'Deploying to Blockchain...' : 'Deploy to Blockchain'}
                </Button>
            </div>
        </main>
    );
}