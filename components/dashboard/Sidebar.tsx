'use client';

import {
    FaHome,
    FaUpload,
    FaPaperPlane,
    FaCheckCircle,
    FaUserCog,
    FaQuestionCircle,
    FaBars,
} from "react-icons/fa";
import { usePathname, useRouter } from 'next/navigation';
import Logo from "../ui/Logo";
import { MenuButton, type SidebarMenuItem } from "../ui/MenuButton";

const sidebarItems: (SidebarMenuItem & { route: string })[] = [
    {
        id: 'dashboard',
        label: 'Dashboard',
        icon: FaHome,
        route: '/dashboard'
    },
    {
        id: 'upload-template',
        label: 'Upload Template',
        icon: FaUpload,
        route: '/dashboard/upload-template'
    },
    {
        id: 'issue-document',
        label: 'Issue Document',
        icon: FaPaperPlane,
        route: '/dashboard/issue-document'
    },
    {
        id: 'issued-documents',
        label: 'Issued Documents',
        icon: FaCheckCircle,
        route: '/dashboard/issued-documents'
    },
    {
        id: 'user-management',
        label: 'User Management',
        icon: FaUserCog,
        route: '/dashboard/user-management'
    },
    {
        id: 'help-support',
        label: 'Help & Support',
        icon: FaQuestionCircle,
        route: '/dashboard/help-support'
    }
];

interface SidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
}

export function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();

    return (
        <>
            {/* Sidebar - Fixed on mobile, static on desktop */}
            <div className={`
                fixed lg:static inset-y-0 left-0 z-50 rounded-none
                w-64 xl:w-72 bg-background-muted lg:bg-background-muted/30 border border-border
                transform transition-transform duration-300 ease-in-out lg:transform-none
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                lg:block flex-shrink-0
            `}>
                <nav className="h-full max-h-full w-[90%] mx-auto flex flex-col">
                    <div className="w-full h-44 flex items-center justify-center">
                        <Logo />
                    </div>
                    <div className="flex flex-col">
                        {sidebarItems.map((item) => (
                            <MenuButton
                                key={item.id}
                                item={item}
                                onClick={() => {
                                    router.push(item.route);
                                    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                                        setSidebarOpen(false);
                                    }
                                }}
                                isActive={pathname === item.route}
                                variant="sidebar"
                            />
                        ))}
                    </div>
                </nav>
            </div>

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 rounded-none lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </>
    );
}

interface HamburgerMenuProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
}

export function HamburgerMenu({ sidebarOpen, setSidebarOpen }: HamburgerMenuProps) {
    return (
        <button className="lg:hidden mr-2" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <FaBars className="w-8 h-8 rounded-none" />
        </button>
    );
}
