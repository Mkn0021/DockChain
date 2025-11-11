"use client";

import MenuItem from "./MenuItem";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/types/auth.type";
import { getInitialsAndColor } from "@/utils/profile.util";
import { LOGOUT_BUTTON, PROFILE_MENU_ITEMS } from "@/data/dashboard.data";
import ApiClient from "@/lib/api-client";
import { useAlert } from "../providers/AlertProvider";

interface ProfileContainerProps {
    user: User;
    className?: string;
}

const ProfileContainer: React.FC<ProfileContainerProps> = ({
    user,
    className = "",
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const avatarRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const { showAlert } = useAlert();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && avatarRef.current) {
                const clickedOutsideDropdown = !dropdownRef.current.contains(
                    event.target as Node
                );
                const clickedOutsideAvatar = !avatarRef.current.contains(
                    event.target as Node
                );

                if (isOpen && clickedOutsideDropdown && clickedOutsideAvatar) {
                    setIsOpen(false);
                }
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleLogout = async () => {
        setIsOpen(false);
        try {
            await ApiClient.post("/auth/logout");
            router.push("/");
        } catch (error) {
            showAlert(`Logout failed: ${error}`, "error");
            router.push("/login");
        }
    };

    const profileMenuItems = PROFILE_MENU_ITEMS(setIsOpen);

    return (
        <div className={`relative ${className}`}>
            {/* Profile Button */}
            <div className="relative">
                <div
                    ref={avatarRef}
                    onClick={toggleDropdown}
                    className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-sm font-semibold text-white shadow-soft transition-all duration-200 hover:scale-110 ${
                        getInitialsAndColor(user.name).colorClass
                    }`}
                    aria-expanded={isOpen}
                    aria-haspopup="true"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            toggleDropdown();
                        }
                    }}
                >
                    {getInitialsAndColor(user.name).initials}
                </div>
            </div>

            {/* Floating Dropdown Card */}
            {isOpen && (
                <div
                    ref={dropdownRef}
                    className="absolute right-0 top-full z-50 mt-4 w-80 animate-fade-in border border-border bg-background shadow-large duration-200 dark:border-border-dark dark:bg-background-dark"
                >
                    <div className="mx-auto w-72 py-2">
                        {/* User Info */}
                        <div className="rounded-none border-b border-border p-6 dark:border-border-dark">
                            <div className="flex items-center gap-4">
                                <div
                                    className={`flex h-12 w-12 items-center justify-center rounded-full text-lg font-medium text-white ${
                                        getInitialsAndColor(user.name)
                                            .colorClass
                                    }`}
                                >
                                    {getInitialsAndColor(user.name).initials}
                                </div>
                                <div className="flex flex-col items-start self-start">
                                    <h4 className="m-0 overflow-x-auto whitespace-nowrap">
                                        {user.name}
                                    </h4>
                                    {user.email && (
                                        <p className="text-xs text-text-secondary dark:text-text-darkSecondary">
                                            {user.email}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Menu Items */}
                        <div className="py-2">
                            {profileMenuItems.map((item, index) => (
                                <MenuItem
                                    key={index}
                                    item={item}
                                    variant="dropdown"
                                />
                            ))}
                        </div>

                        {/* Logout */}
                        <div className="rounded-none border-t border-border py-2 dark:border-border-dark">
                            <button
                                onClick={handleLogout}
                                className="flex w-full items-center gap-4 border-none px-6 py-4 text-left text-red-600 transition-all duration-150 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/10"
                            >
                                <LOGOUT_BUTTON.icon className="h-5 w-5 flex-shrink-0" />
                                <span className="font-medium">
                                    {LOGOUT_BUTTON.label}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileContainer;
