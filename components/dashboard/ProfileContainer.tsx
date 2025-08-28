'use client';

import React, { useState, useRef, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import { FaUser, FaSignOutAlt, FaCog, FaBell } from 'react-icons/fa';
import Image from 'next/image';
import { User } from '@/types/user';
import { MenuButton, type MenuItem } from '../ui/MenuButton';

interface ProfileContainerProps {
    user: User;
    className?: string;
}

const ProfileContainer: React.FC<ProfileContainerProps> = ({
    user,
    className = ''
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const avatarRef = useRef<HTMLDivElement>(null);

    const handleLogout = () => {
        signOut({ callbackUrl: '/login' });
        setIsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                avatarRef.current &&
                !avatarRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, []);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const getInitialsAndColor = (name: string) => {
        const initials = name
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);

        const colors = [
            'bg-blue-500', 'bg-green-500', 'bg-red-500', 'bg-yellow-500',
            'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500',
            'bg-orange-500', 'bg-cyan-500', 'bg-lime-500', 'bg-amber-500'
        ];
        const hash = initials.split('').reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
        const colorClass = colors[Math.abs(hash) % colors.length];
        return { initials, colorClass };
    };

    const profileMenuItems: MenuItem[] = [
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

    return (
        <div className={`relative ${className}`}>
            {/* Profile Button */}
            <div className="relative">
                {user.profileImageUrl ? (
                    <Image
                        onClick={toggleDropdown}
                        src={user.profileImageUrl}
                        alt={`${user.name}'s avatar`}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-primary hover:ring-opacity-50 transition-all duration-200 shadow-soft"
                        aria-expanded={isOpen}
                        aria-haspopup="true"
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                toggleDropdown();
                            }
                        }}
                    />
                ) : (
                    <div
                        ref={avatarRef}
                        onClick={toggleDropdown}
                        className={`w-10 h-10 rounded-full text-white flex items-center justify-center font-semibold text-sm hover:scale-110 cursor-pointer transition-all duration-200 shadow-soft ${getInitialsAndColor(user.name).colorClass}`}
                        aria-expanded={isOpen}
                        aria-haspopup="true"
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                toggleDropdown();
                            }
                        }}
                    >
                        {getInitialsAndColor(user.name).initials}
                    </div>
                )}
            </div>

            {/* Floating Dropdown Card */}
            {isOpen && (
                <div
                    ref={dropdownRef}
                    className="absolute right-0 top-full mt-4 w-80 bg-background dark:bg-background-dark shadow-large border border-border dark:border-border-dark z-50 animate-fade-in duration-200"
                >
                    <div className="w-72 mx-auto py-2">
                        {/* User Info */}
                        <div className="p-6 border-b border-border dark:border-border-dark rounded-none">
                            <div className="flex items-center gap-4">
                                {user.profileImageUrl ? (
                                    <Image
                                        src={user.profileImageUrl}
                                        alt={`${user.name}'s avatar`}
                                        width={48}
                                        height={48}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className={`w-12 h-12 rounded-full text-white flex items-center justify-center font-medium text-lg ${getInitialsAndColor(user.name).colorClass}`}>
                                        {getInitialsAndColor(user.name).initials}
                                    </div>
                                )}
                                <div className="flex flex-col self-start items-start">
                                    <h4 className="m-0 whitespace-nowrap overflow-x-auto">{user.name}</h4>
                                    {user.email && (
                                        <p className="text-text-secondary dark:text-text-darkSecondary text-xs">{user.email}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Menu Items */}
                        <div className="py-2">
                            {profileMenuItems.map((item, index) => (
                                <MenuButton
                                    key={index}
                                    item={item}
                                    variant="dropdown"
                                />
                            ))}
                        </div>

                        {/* Logout */}
                        <div className="border-t border-border dark:border-border-dark py-2 rounded-none">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-4 px-6 py-4 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all duration-150 border-none"
                            >
                                <FaSignOutAlt className="w-5 h-5 flex-shrink-0" />
                                <span className="font-medium">Log Out</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileContainer;