'use client';

import { useState } from 'react';
import type { User } from '@/types/user';
import ProfileContainer from "./ProfileContainer";
import { Sidebar, HamburgerMenu } from "./Sidebar";

interface DashboardLayoutProps {
    user: User;
}

export function DashboardLayout({ user }: DashboardLayoutProps) {
    const [activeItem, setActiveItem] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const pageData = {
        'dashboard': { title: 'Dashboard', description: 'Welcome to your dashboard overview' },
        'upload-template': { title: 'Upload Template', description: 'This is the upload template page. Implement your template upload logic here.' },
        'issued-documents': { title: 'Issued Documents', description: 'This is the issued documents page. Implement your document management logic here.' },
        'issue-document': { title: 'Issue Document', description: 'This is the issue document page. Implement your document issuing logic here.' },
        'user-management': { title: 'User Management', description: 'This is the user management page. Implement your user management logic here.' },
        'help-support': { title: 'Help & Support', description: 'This is the help and support page. Implement your support system here.' }
    };

    const renderContent = () => {
        // Get page data for any page including dashboard
        const page = pageData[activeItem as keyof typeof pageData];
        if (!page) {
            // Fallback to dashboard if page not found
            const dashboardPage = pageData['dashboard'];
            return (
                <div className="h-screen flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold mb-4">{dashboardPage.title}</h1>
                        <p className="text-gray-600">{dashboardPage.description}</p>
                    </div>
                </div>
            );
        }

        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">{page.title}</h1>
                    <p className="text-gray-600">{page.description}</p>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-white h-screen rounded-none flex">
            <Sidebar
                activeItem={activeItem}
                setActiveItem={setActiveItem}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />

            <div className="flex-1 flex flex-col lg:ml-0 min-w-0 bg-background dark:bg-background-dark">
                <div className="m-0 text-center flex justify-between items-center w-full px-6 py-8 md:px-12 lg:px-20 shadow-none h-[180px] relative">
                    <div className="flex items-center gap-4">
                        <HamburgerMenu
                            sidebarOpen={sidebarOpen}
                            setSidebarOpen={setSidebarOpen}
                        />
                        <h3 className='m-0 p-0'>{pageData[activeItem as keyof typeof pageData]?.title || 'Dashboard'}</h3>
                    </div>
                    <ProfileContainer user={user} />
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-auto">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}
