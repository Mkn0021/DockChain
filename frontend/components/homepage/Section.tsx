import React from "react";

interface SectionProps {
    children: React.ReactNode;
    className?: string;
}

export const Section: React.FC<SectionProps> = ({
    children,
    className = "",
}) => {
    return (
        <section
            className={`flex w-full flex-col items-center px-2 py-20 sm:px-4 ${className}`}
        >
            <div className="flex w-full max-w-[90%] flex-col items-center gap-8 sm:gap-12">
                <div className="flex w-full max-w-6xl flex-col items-center gap-6 sm:gap-8">
                    {children}
                </div>
            </div>
        </section>
    );
};
