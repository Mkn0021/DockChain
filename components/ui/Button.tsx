import React from 'react';
import Link from 'next/link';

interface ButtonProps {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary';
    href?: string;
    onClick?: () => void;
    className?: string;
    type?: 'button' | 'submit' | 'reset';
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    href,
    onClick,
    className = '',
    type = 'button',
}) => {
    const baseClasses = 'btn';
    const variantClasses = variant === 'primary' ? 'btn-primary' : 'btn-secondary';
    const combinedClasses = `${baseClasses} ${variantClasses} ${className}`.trim();

    if (href) {
        return (
            <Link href={href} className={combinedClasses}>
                {children}
            </Link>
        );
    }

    return (
        <button type={type} onClick={onClick} className={combinedClasses}>
            {children}
        </button>
    );
};
