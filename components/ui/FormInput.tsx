import React from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
    label?: string;
    className?: string;
    as?: 'input' | 'textarea';
    rows?: number;
}

const FormInput: React.FC<FormInputProps> = ({ label, className, as = 'input', rows, ...props }) => (
    <div className="w-full">
        {label && <label className="block mb-1 text-sm font-medium">{label}</label>}
        {as === 'textarea' ? (
            <textarea
                className={`w-full h-full placeholder-text-secondary border-2 border-border focus:border-primary outline-none transition-colors duration-200 rounded-xl px-6 py-4 resize-vertical ${className}`}
                rows={rows || 6}
                {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
            />
        ) : (
            <input
                className={`w-full h-full placeholder-text-secondary border-2 border-border focus:border-primary outline-none transition-colors duration-200 rounded-xl px-6 py-4 ${className}`}
                {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
            />
        )}
    </div>
);

export default FormInput;