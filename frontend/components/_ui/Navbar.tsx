import React from "react";
import Logo from "./Logo";

interface NavbarProps {
    className?: string;
    children?: React.ReactNode;
}

export const Navbar: React.FC<NavbarProps> = ({ className, children }) => {
    return (
        <header
            className={`relative m-0 flex h-28 w-full items-center justify-between px-6 
        py-8 text-center shadow-none md:px-12 lg:px-20 ${className}`}
        >
            <Logo />
            <div className="hidden gap-4 md:flex">{children}</div>
        </header>
    );
};
