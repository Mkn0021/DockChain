import { FaUser, FaCog, FaBell, FaSignOutAlt } from 'react-icons/fa';
import { MenuItem } from '../(components)/MenuItem';


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