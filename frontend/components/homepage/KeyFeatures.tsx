"use client";

import React from "react";
import { cn } from "@/utils/cn.util";
import { motion } from "motion/react";
import { IconCheck } from "@tabler/icons-react";
import { KEY_FEATURES } from "@/data/homepage.data";

export default function KeyFeatures({ className }: { className?: string }) {
    return (
        <motion.div
            initial={{
                y: 80,
                scale: 0.85,
            }}
            whileInView={{
                y: 0,
                scale: 1,
            }}
            transition={{
                duration: 0.3,
                ease: "easeOut",
            }}
            className={cn(
                "flex flex-col items-start gap-4 rounded-2xl bg-neutral-950 px-8 py-6 shadow-lg",
                "absolute bottom-20 left-0 mx-auto w-fit",
                className
            )}
        >
            <h3 className="m-0 text-lg font-semibold text-white">
                Key Features
            </h3>
            {
                KEY_FEATURES.map((feature) => (
                    <KeyFeatureItem key={feature} title={feature} />
                ))
            }
        </motion.div>
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
