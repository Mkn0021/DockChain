"use client";

import { cn } from "@/utils/cn.util";
import React from "react";
import Logo from "../_ui/Logo";
import { DASHBOARD_ROUTES } from "@/data/dashboard.data";
import MenuItem from "../dashboard/MenuItem";
import {
    IconCheck,
    IconBrandDatabricks,
    IconLoader2,
} from "@tabler/icons-react";
import StepperLayout from "../dashboard/StepperLayout";
import InputBox from "../_ui/InputBox";
import { Button } from "../_ui/Button";
import { MdNavigateNext } from "react-icons/md";

export default function HeroDashboard({ className }: { className?: string }) {
    return (
        <div
            className={cn(
                "align-center m-auto flex w-[95%] justify-center bg-neutral-50",
                "border-2 border-neutral-200 shadow-[0_0_0_12px_#fafafa]",
                className
            )}
        >
            <DashboardSidebar />
            <DashboardContent />
        </div>
    );
}

function DashboardSidebar() {
    return (
        <div className="align-center flex h-full w-60 flex-col justify-start gap-2 rounded-[30px] rounded-br-none rounded-tr-none border-r border-neutral-300 bg-neutral-200/50 p-4">
            <Logo className="mx-auto size-20" />
            {Object.values(DASHBOARD_ROUTES).map(({ title, icon }) => (
                <MenuItem
                    key={title}
                    isActive={title === "Issued Documents"}
                    item={{
                        label: title,
                        icon: icon,
                    }}
                    variant="sidebar"
                />
            ))}
        </div>
    );
}

function DashboardContent() {
    return (
        <div className="flex flex-1 flex-col p-8">
            <div className="flex items-center gap-2">
                <IconBrandDatabricks className="size-8 text-neutral-500" />
                <h4 className="m-0 text-3xl text-neutral-800">
                    Issued Document
                </h4>
            </div>
            <div className="flex w-full items-center justify-between py-12">
                <Circle />
                <Line />
                <Circle />
                <Line />
                <Circle variant="current" />
                <Line variant="pending" />
                <Circle variant="pending" step="3" />
                <Line variant="pending" />
                <Circle variant="pending" step="4" />
            </div>
            <div className="flex h-full items-center justify-center gap-8">
                <DocumentInfoCard />
                <div className="flex w-60 flex-col gap-6">
                    <InputBox
                        label="Recipent Email"
                        placeholder="Enter recipent email Address"
                        className=""
                    />
                    <InputBox
                        label="Message"
                        placeholder="Enter custom massage for recipent"
                        rows={3}
                    />
                </div>
            </div>
            <div className="l mt-4 flex items-center justify-center">
                <Button
                    variant="primary"
                    className="flex w-72 items-center justify-center gap-2"
                >
                    Deploy to Blockchain
                    <MdNavigateNext size={24} />
                </Button>
            </div>
        </div>
    );
}

function DocumentInfoCard() {
    return (
        <div className="h-full max-w-md rounded-xl border border-neutral-300 bg-neutral-200 p-6">
            <h3 className="m-0 mb-4 text-xl text-neutral-800">
                Document Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <p className="m-0 text-sm text-neutral-600">Document ID</p>
                    <p className="m-0 text-base text-neutral-800">
                        123e4567-e89b-12d3
                    </p>
                </div>
                <div>
                    <p className="m-0 text-sm text-neutral-600">Issued To</p>
                    <p className="m-0 text-base text-neutral-800">John Doe</p>
                </div>
                <div>
                    <p className="m-0 text-sm text-neutral-600">Issued By</p>
                    <p className="m-0 text-base text-neutral-800">
                        Blockchain Authority
                    </p>
                </div>
                <div>
                    <p className="m-0 text-sm text-neutral-600">Issue Date</p>
                    <p className="m-0 text-base text-neutral-800">
                        Jan 1, 2024
                    </p>
                </div>
            </div>
        </div>
    );
}

function Line({
    variant = "completed",
}: {
    variant?: "completed" | "pending";
}) {
    return (
        <div
            className={cn(
                "flex h-1 flex-1",
                variant === "completed" ? "bg-primary" : "bg-gray-400"
            )}
        ></div>
    );
}

function Circle({
    step,
    variant = "completed",
}: {
    step?: string;
    variant?: "completed" | "current" | "pending";
}) {
    return (
        <div
            className={cn(
                "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-white",
                variant === "pending" ? "bg-gray-400" : "bg-primary"
            )}
        >
            {variant === "completed" && (
                <IconCheck className="size-6 text-white" />
            )}
            {variant === "current" && (
                <IconLoader2 className="size-6 animate-spin text-white" />
            )}
            {variant === "pending" && (
                <span className="text-lg font-bold text-white">{step}</span>
            )}
        </div>
    );
}
