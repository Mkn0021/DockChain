"use client";

import { useState } from 'react';
import Stepper from "@/components/dashboard/StepperLayout";
import { Button } from '@/components/ui/Button';

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
    return (
        <Stepper steps={IssueDocumentSteps} current={currentStep} setCurrent={setCurrentStep}>
            {currentStep === 0 && (
                <div className="mt-8">
                    <h3 className="text-lg font-medium mb-2">Select a Design</h3>
                    <p>Design selection content goes here.</p>
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
