import React from "react";

interface InfoBoxProps {
    title?: string;
    items: string[];
    className?: string;
}

const InfoBox: React.FC<InfoBoxProps> = ({ title, items, className = "" }) => (
    <div
        className={`rounded-lg border border-blue-200 bg-blue-50 px-4 py-6 ${className}`}
    >
        {title && <h4 className="m-0 mb-2 p-0 text-blue-900">{title}</h4>}
        <ul className="space-y-2 text-sm text-blue-800">
            {items.map((item, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                    <span className="text-primary">•</span>
                    <span>{item}</span>
                </li>
            ))}
        </ul>
    </div>
);

export default InfoBox;
