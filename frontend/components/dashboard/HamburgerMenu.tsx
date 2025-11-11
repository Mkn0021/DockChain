import { FaBars } from "react-icons/fa";

interface HamburgerMenuProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
}

export function HamburgerMenu({
    sidebarOpen,
    setSidebarOpen,
}: HamburgerMenuProps) {
    return (
        <button
            className="mr-2 lg:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
        >
            <FaBars className="h-8 w-8 rounded-none" />
        </button>
    );
}
