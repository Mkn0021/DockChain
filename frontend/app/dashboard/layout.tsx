'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { authService } from '@/lib/services/auth.service';
import type { User } from '@/types/auth.type';
import ProfileContainer from "./(components)/ProfileContainer";
import { Sidebar } from "./(components)/Sidebar";
import { HamburgerMenu } from "./(components)/HamburgerMenu";
import { PAGE_PATH, type PagePath } from './(data)';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const fetchUser = () => {
            if (!authService.isAuthenticated()) {
                router.push('/login');
                return;
            }

            const userData = authService.getUser();
            if (userData) {
                setUser(userData);
            } else {
                router.push('/login');
            }
            setLoading(false);
        };

        fetchUser();
    }, [router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-lg">Loading...</div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="bg-white h-screen rounded-none flex">
            <Sidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />

            <div className="flex-1 flex flex-col min-w-0 bg-background dark:bg-background-dark">
                <div className="m-0 text-center flex justify-between items-center w-full px-6 py-8 md:px-12 lg:px-20 shadow-none h-44 relative">
                    <div className="flex items-center gap-4">
                        <HamburgerMenu
                            sidebarOpen={sidebarOpen}
                            setSidebarOpen={setSidebarOpen}
                        />
                        <h2 className='m-0 p-0'>{PAGE_PATH[pathname as PagePath]?.title || 'Dashboard'}</h2>
                    </div>
                    <ProfileContainer user={user} />
                </div>

                <div className="flex-1 overflow-auto w-full px-6 md:px-12 lg:px-20">
                    {children}
                </div>
            </div>
        </div>
    );
}
