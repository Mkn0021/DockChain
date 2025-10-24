import { MenuItem } from '../(components)/MenuItem';
import {
    FaUser, FaCog, FaBell, FaSignOutAlt,
    FaHome, FaUpload, FaPaperPlane, FaCheckCircle, FaUserCog, FaQuestionCircle
} from 'react-icons/fa';

export const PROFILE_MENU_ITEMS = (setIsOpen: (isOpen: boolean) => void): MenuItem[] => [
    {
        icon: FaUser,
        label: 'View Profile',
        action: () => {
            console.log('View Profile clicked');
            setIsOpen(false);
        }
    },
    {
        icon: FaCog,
        label: 'Account Settings',
        action: () => {
            console.log('Settings clicked');
            setIsOpen(false);
        }
    },
    {
        icon: FaBell,
        label: 'Notifications',
        action: () => {
            console.log('Notifications clicked');
            setIsOpen(false);
        }
    },
];

export const LOGOUT_BUTTON = {
    icon: FaSignOutAlt,
    label: 'Log Out',
    action: (setIsOpen: (isOpen: boolean) => void) => {
        console.log('Logout clicked');
        setIsOpen(false);
    }
};

export const ROUTES = {
    dashboard: {
        path: '/dashboard',
        title: 'Dashboard',
        icon: FaHome
    },
    uploadTemplate: {
        path: '/dashboard/upload-template',
        title: 'Upload Template',
        icon: FaUpload
    },
    issueDocument: {
        path: '/dashboard/issue-document',
        title: 'Issue Document',
        icon: FaPaperPlane
    },
    issuedDocuments: {
        path: '/dashboard/issued-documents',
        title: 'Issued Documents',
        icon: FaCheckCircle
    },
    userManagement: {
        path: '/dashboard/user-management',
        title: 'User Management',
        icon: FaUserCog
    },
    helpSupport: {
        path: '/dashboard/help-support',
        title: 'Help & Support',
        icon: FaQuestionCircle
    }
} as const;

export const SIDEBAR_ITEMS = (navigateToRoute: (route: string) => void): MenuItem[] => 
    Object.entries(ROUTES).map(([id, route]) => ({
        id,
        label: route.title,
        icon: route.icon,
        action: () => navigateToRoute(route.path)
    }));

export const PAGE_PATH = Object.values(ROUTES).reduce((acc, route) => {
    acc[route.path] = { title: route.title };
    return acc;
}, {} as Record<string, { title: string }>);

export type PagePath = keyof typeof PAGE_PATH;