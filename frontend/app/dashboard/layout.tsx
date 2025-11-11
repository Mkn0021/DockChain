"use client";

import { useState, useEffect } from "react";
import type { User } from "@/types/auth.type";
import { usePathname, useRouter } from "next/navigation";
import { DashboardPagePath } from "@/types/document.type";
import { DASHBOARD_PAGE_PATH } from "@/data/dashboard.data";
import { Sidebar } from "@/components/dashboard/Sidebar";
import LoadingSpinner from "@/components/_ui/LoadingSpinner";
import { HamburgerMenu } from "@/components/dashboard/HamburgerMenu";
import ProfileContainer from "@/components/dashboard/ProfileContainer";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const fetchUser = () => {
            const userData =
                typeof window === "undefined"
                    ? null
                    : (JSON.parse(
                          localStorage.getItem("user") || "null"
                      ) as User | null);

            if (userData) {
                setUser(userData);
            } else {
                router.push("/login");
            }
            setLoading(false);
        };

        fetchUser();
    }, [router]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center rounded-none bg-white">
                <LoadingSpinner />
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="flex h-screen rounded-none bg-white">
            <Sidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />

            <div className="flex min-w-0 flex-1 flex-col bg-background dark:bg-background-dark">
                <div className="relative m-0 flex h-44 w-full items-center justify-between px-6 py-8 text-center shadow-none md:px-12 lg:px-20">
                    <div className="flex items-center gap-4">
                        <HamburgerMenu
                            sidebarOpen={sidebarOpen}
                            setSidebarOpen={setSidebarOpen}
                        />
                        <h2 className="m-0 p-0">
                            {DASHBOARD_PAGE_PATH[pathname as DashboardPagePath]
                                ?.title || "Dashboard"}
                        </h2>
                    </div>
                    <ProfileContainer user={user} />
                </div>

                <div className="w-full flex-1 overflow-auto px-6 md:px-12 lg:px-20">
                    {children}
                </div>
            </div>
        </div>
    );
}
