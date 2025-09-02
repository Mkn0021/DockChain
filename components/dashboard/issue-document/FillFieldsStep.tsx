import { Template } from '@/types/template';
import FormInput from '@/components/ui/FormInput';
import { useStepper } from '../StepperLayout';
import { useEffect } from 'react';

interface FillFieldsStepProps {
    selectedTemplate: Template;
    formValues: Record<string, string>;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function FillFieldsStep({
    selectedTemplate,
    formValues,
    onInputChange
}: FillFieldsStepProps) {
    const { setCanGoToNextStep } = useStepper();

    useEffect(() => {
        const allRequiredFilled = selectedTemplate.variables
            .filter((field) => field.required)
            .every((field) => formValues[field.key]?.trim());
            
        setCanGoToNextStep(allRequiredFilled);
    }, [formValues, setCanGoToNextStep]);

    return (
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
                            onChange={onInputChange}
                        />
                    );
                })}
            </form>
        </div>
    );
}