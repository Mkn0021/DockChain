import React from 'react';
import Logo from '../ui/Logo';

interface NavbarProps {
    children?: React.ReactNode;
}

export const Navbar: React.FC<NavbarProps> = ({ children }) => {
    return (
        <div className="m-0 text-center flex justify-between items-center w-full px-6 py-8 md:px-12 lg:px-20 shadow-none h-28 relative">
            <Logo />
            <div className="hidden md:flex gap-4">
                {children}
            </div>
        </div>
    );
};

