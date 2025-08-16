'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import type { User } from '@/types/user';
import ProfileContainer from "./ProfileContainer";
import { Sidebar, HamburgerMenu } from "./Sidebar";

interface DashboardLayoutProps {
    user: User;
    children: React.ReactNode;
}

export function DashboardLayout({ user, children }: DashboardLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();

    const pageData = {
        '/dashboard': { title: 'Dashboard' },
        '/dashboard/upload-template': { title: 'Upload Template' },
        '/dashboard/issued-documents': { title: 'Issued Documents' },
        '/dashboard/issue-document': { title: 'Issue Document' },
        '/dashboard/user-management': { title: 'User Management' },
        '/dashboard/help-support': { title: 'Help & Support' }
    };

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
                        <h3 className='m-0 p-0'>{pageData[pathname as keyof typeof pageData]?.title || 'Dashboard'}</h3>
                    </div>
                    <ProfileContainer user={user} />
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-auto w-full px-6 py-8 md:px-12 lg:px-20">
                    {children}
                </div>
            </div>
        </div>
    );
}
