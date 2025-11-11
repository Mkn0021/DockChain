"use client";

import MenuItem from "./MenuItem";
import Logo from "@/components/_ui/Logo";
import { SIDEBAR_ITEMS, DASHBOARD_ROUTES } from "@/data/dashboard.data";
import { usePathname, useRouter } from "next/navigation";

interface SidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
}

export function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();

    const navigateToRoute = (route: string) => {
        router.push(route);
        if (typeof window !== "undefined" && window.innerWidth < 1024) {
            setSidebarOpen(false);
        }
    };

    const sidebarItems = SIDEBAR_ITEMS(navigateToRoute);

    return (
        <>
            {/* Sidebar - Fixed on mobile, static on desktop */}
            <div
                className={`
                fixed inset-y-0 left-0 z-50 w-64 transform
                rounded-none border border-border bg-background-muted transition-transform duration-300
                ease-in-out lg:static lg:transform-none lg:bg-background-muted/30 xl:w-72
                ${
                    sidebarOpen
                        ? "translate-x-0"
                        : "-translate-x-full lg:translate-x-0"
                }
                flex-shrink-0 lg:block
            `}
            >
                <nav className="mx-auto flex h-full max-h-full w-[90%] flex-col">
                    <div className="flex h-44 w-full items-center justify-center">
                        <Logo />
                    </div>
                    <div className="flex flex-col">
                        {sidebarItems.map((item) => {
                            const itemPath =
                                DASHBOARD_ROUTES[
                                    item.id as keyof typeof DASHBOARD_ROUTES
                                ]?.path || "";
                            return (
                                <MenuItem
                                    key={item.id}
                                    item={item}
                                    isActive={pathname === itemPath}
                                    variant="sidebar"
                                />
                            );
                        })}
                    </div>
                </nav>
            </div>

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 rounded-none bg-black bg-opacity-50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </>
    );
}
