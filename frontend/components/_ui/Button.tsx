import React from "react";
import Link from "next/link";
import { cn } from "@/utils/cn.util";

type ButtonProps = {
    children: React.ReactNode;
    className?: string;
    variant?: "primary" | "secondary";
} & React.ButtonHTMLAttributes<HTMLButtonElement> &
    React.AnchorHTMLAttributes<HTMLAnchorElement>;

export const Button = ({
    children,
    className,
    variant = "primary",
    ...props
}: ButtonProps) => {
    const { href, ...rest } = props;
    const combinedClasses = cn(
        "text-center px-6 py-4 text-base font-medium leading-6 transition-all duration-150 no-underline m-2",
        "hover:bg-primary-hover hover:text-white hover:-translate-y-1 dark:hover:bg-gray-50 dark:hover:text-zinc-900",
        "active:outline active:outline-primary active:outline-offset-[3px] active:outline-2",
        variant === "primary"
            ? "bg-primary dark:bg-primary-dark text-white"
            : "border border-primary dark:border-white text-primary dark:text-white self-center",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none",
        className
    );

    if (href) {
        return (
            <Link
                href={href}
                className={combinedClasses}
                {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
            >
                {children}
            </Link>
        );
    }

    return (
        <button
            className={combinedClasses}
            {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
        >
            {children}
        </button>
    );
};
