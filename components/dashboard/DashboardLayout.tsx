import { } from "react-icons/fa6";
import type { User } from '@/types/user';
import { Navbar } from "../layout/Navbar";
import ProfileContainer from "./ProfileContainer";

interface DashboardLayoutProps {
    user: User;
}
export function DashboardLayout({ user }: DashboardLayoutProps) {
    return (
        <div className="bg-white h-screen rounded-none">
            <Navbar>
                <ProfileContainer user={user} />
            </Navbar>
        </div>
    )
}
