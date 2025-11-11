import React from "react";
import Image from "next/image";

interface FeatureCardProps {
    imageSrc: string;
    imageAlt: string;
    title: string;
    description: string;
    className?: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
    imageSrc,
    imageAlt,
    title,
    description,
    className = "",
}) => {
    return (
        <div className={`flex h-full flex-col ${className}`.trim()}>
            <div className="relative mb-4 aspect-square w-full bg-gradient-to-t from-black via-[#081E83] to-[#0F2CB7] p-4">
                <Image
                    src={imageSrc}
                    alt={imageAlt}
                    width={300}
                    height={200}
                    className="h-full w-full object-contain"
                />
            </div>
            <div className="flex flex-grow flex-col">
                <h3 className="mb-2">{title}</h3>
                <p className="hyphens-auto break-all px-4 text-center leading-relaxed">
                    {description}
                </p>
            </div>
        </div>
    );
};
