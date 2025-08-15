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
import Logo from "../ui/Logo";
import { MenuButton, type SidebarMenuItem } from "../ui/MenuButton";

const sidebarItems: SidebarMenuItem[] = [
    {
        id: 'dashboard',
        label: 'Dashboard',
        icon: FaHome
    },
    {
        id: 'upload-template',
        label: 'Upload Template',
        icon: FaUpload
    },
    {
        id: 'issue-document',
        label: 'Issue Document',
        icon: FaPaperPlane
    },
    {
        id: 'issued-documents',
        label: 'Issued Documents',
        icon: FaCheckCircle
    },
    {
        id: 'user-management',
        label: 'User Management',
        icon: FaUserCog
    },
    {
        id: 'help-support',
        label: 'Help & Support',
        icon: FaQuestionCircle
    }
];

interface SidebarProps {
    activeItem: string;
    setActiveItem: (item: string) => void;
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
}

export function Sidebar({ activeItem, setActiveItem, sidebarOpen, setSidebarOpen }: SidebarProps) {
    return (
        <>
            {/* Sidebar */}
            <div className={`
                fixed lg:relative inset-y-0 left-0 z-50 rounded-none
                w-72 bg-background-muted lg:bg-background-muted/30 border border-border
                transform transition-transform duration-300 ease-in-out
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                lg:block
            `}>
                <nav className="h-full max-h-full w-[90%] mx-auto flex flex-col">
                    <div className="w-full h-[180px] flex items-center justify-center">
                        <Logo />
                    </div>
                    <div className="flex flex-col">
                        {sidebarItems.map((item) => (
                            <MenuButton
                                key={item.id}
                                item={item}
                                onClick={() => {
                                    setActiveItem(item.id);
                                    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                                        setSidebarOpen(false);
                                    }
                                }}
                                isActive={activeItem === item.id}
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
