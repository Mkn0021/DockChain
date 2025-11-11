import React from "react";
import { cn } from "@/utils/cn.util";
import {
    IconBrandGithubFilled,
    IconRosetteDiscountCheckFilled,
    IconSpy,
} from "@tabler/icons-react";

export default function VerificationMobile({
    className,
}: {
    className?: string;
}) {
    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center rounded-2xl bg-neutral-950 px-4 py-6",
                "border-2 border-neutral-400 shadow-[0_0_0_4px_#0f0f0f]",
                "md:absolute md:right-0 md:top-20 md:w-auto md:max-w-72",
                className
            )}
        >
            <VerificationHeader />
            <GithubEidCard />
            <AnonymousVerificationCard />
        </div>
    );
}

function VerificationHeader() {
    return (
        <>
            <IconRosetteDiscountCheckFilled className="size-24 text-green-500" />
            <h3 className="m-0 mb-2 text-nowrap text-xl text-neutral-100">
                Verification Successful
            </h3>
            <p className="text-center text-xs text-neutral-400">
                Your document has been successfully verified and is authentic.
            </p>
        </>
    );
}

function GithubEidCard() {
    return (
        <div className="my-4 flex w-full flex-col gap-24 md:gap-16 rounded-xl bg-gradient-to-tl from-gray-800 via-gray-700 to-gray-600 p-4">
            <h4 className="m-0 text-lg text-neutral-200">Github eID</h4>
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <p className="mr-2 text-xs text-neutral-300">
                        Nov. 11, 2025
                    </p>
                    <IconRosetteDiscountCheckFilled className="size-4 text-green-400" />
                    <span className="ml-1 text-xs text-green-400">
                        Verified
                    </span>
                </div>
                <div className="-mt-4 flex items-center justify-center rounded-full border-2 border-white bg-neutral-900 p-1">
                    <IconBrandGithubFilled className="size-6 text-white" />
                </div>
            </div>
        </div>
    );
}

function AnonymousVerificationCard() {
    return (
        <div className="my-4 flex w-full items-start justify-start gap-1 rounded-xl bg-blue-700 p-4">
            <IconSpy className="h-6 w-6 flex-shrink-0 text-blue-200" />
            <div className="mt-0.5 flex flex-col gap-2">
                <p className="ml-1 text-sm text-neutral-200">
                    Anonymous Verification
                </p>
                <p className="text-xs text-blue-200">
                    The verifier can not see the exact value of certain
                    credential attributes. They can only verify if it is within
                    their specified acceptable range.
                </p>
            </div>
        </div>
    );
}
