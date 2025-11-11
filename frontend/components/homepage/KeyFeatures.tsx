import React from "react";
import { cn } from "@/utils/cn.util";
import { IconCheck } from "@tabler/icons-react";

export default function KeyFeatures({ className }: { className?: string }) {
    return (
        <div
            className={cn(
                "flex flex-col items-start gap-4 rounded-2xl bg-neutral-950 px-8 py-6 shadow-lg",
                "absolute bottom-20 left-0 mx-auto w-fit",
                className
            )}
        >
            <h3 className="m-0 text-lg font-semibold text-white">
                Key Features
            </h3>
            <KeyFeatureItem title="Create Ecosystem" />
            <KeyFeatureItem title="Secure Storage" />
            <KeyFeatureItem title="Instant Verification" />
            <KeyFeatureItem title="Global Accessibility" />
            <KeyFeatureItem title="Tamper-Proof Records" />
        </div>
    );
}

export function KeyFeatureItem({ title }: { title: string }) {
    return (
        <div className="flex h-full w-full items-center">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-dark p-px">
                <IconCheck className="size-4 text-white" />
            </div>
            <p className="ml-2 text-nowrap text-sm text-neutral-200">{title}</p>
        </div>
    );
}
