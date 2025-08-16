import React from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

const FormInput: React.FC<FormInputProps> = ({ label, ...props }) => (
    <div className="w-full">
        {label && <label className="block mb-1 text-sm font-medium">{label}</label>}
        <input
            className="w-full h-full placeholder-text-secondary border-2 border-border focus:border-primary outline-none transition-colors duration-200 rounded-xl px-6 py-4"
            {...props}
        />
    </div>
);

export default FormInput;
