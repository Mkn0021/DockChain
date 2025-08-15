import React from 'react';

export interface MenuItem {
    id?: string;
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    action?: () => void;
}

export interface SidebarMenuItem extends MenuItem {
    id: string;
}

interface MenuButtonProps {
    item: MenuItem;
    onClick?: () => void;
    isActive?: boolean;
    variant?: 'sidebar' | 'dropdown';
    className?: string;
}

export const MenuButton: React.FC<MenuButtonProps> = ({
    item,
    onClick,
    isActive = false,
    variant = 'sidebar',
    className = ''
}) => {
    const Icon = item.icon;
    
    const handleClick = () => {
        if (onClick) {
            onClick();
        } else if (item.action) {
            item.action();
        }
    };
    const baseClasses = "w-full flex items-center gap-4 px-6 py-4 text-left transition-all duration-150 border-none";
    
    // Variant-specific styling
    const variantClasses = variant === 'sidebar' && isActive
        ? 'bg-primary/10 text-primary border border-border'
        : variant === 'sidebar'
        ? 'text-text-secondary hover:bg-background-muted hover:text-text-primary'
        : 'text-text-secondary dark:text-text-darkSecondary hover:bg-background-muted dark:hover:bg-background-mutedDark hover:text-text-primary dark:hover:text-text-darkPrimary';

    return (
        <button
            onClick={handleClick}
            className={`${baseClasses} ${variantClasses} ${className}`}
            title={item.label}
        >
            <Icon className="w-5 h-5 flex-shrink-0 rounded-none" />
            <span className="font-medium">{item.label}</span>
        </button>
    );
};
