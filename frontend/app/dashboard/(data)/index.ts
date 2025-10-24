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

export const SIDEBAR_ITEMS = (navigateToRoute: (route: string) => void): MenuItem[] => [
    {
        id: 'dashboard',
        label: 'Dashboard',
        icon: FaHome,
        action: () => navigateToRoute('/dashboard')
    },
    {
        id: 'upload-template',
        label: 'Upload Template',
        icon: FaUpload,
        action: () => navigateToRoute('/dashboard/upload-template')
    },
    {
        id: 'issue-document',
        label: 'Issue Document',
        icon: FaPaperPlane,
        action: () => navigateToRoute('/dashboard/issue-document')
    },
    {
        id: 'issued-documents',
        label: 'Issued Documents',
        icon: FaCheckCircle,
        action: () => navigateToRoute('/dashboard/issued-documents')
    },
    {
        id: 'user-management',
        label: 'User Management',
        icon: FaUserCog,
        action: () => navigateToRoute('/dashboard/user-management')
    },
    {
        id: 'help-support',
        label: 'Help & Support',
        icon: FaQuestionCircle,
        action: () => navigateToRoute('/dashboard/help-support')
    }
]