import { IoCheckmarkCircle, IoCloseCircle, IoAlert } from "react-icons/io5";

export const ALERT_STYLES = {
    success: {
        container: 'bg-green-50 text-green-700 border-green-200',
        icon: 'text-green-600',
        iconComponent: IoCheckmarkCircle,
    },
    error: {
        container: 'bg-red-50 text-red-700 border-red-200',
        icon: 'text-red-600',
        iconComponent: IoCloseCircle,
    },
    info: {
        container: 'bg-blue-50 text-blue-700 border-blue-200',
        icon: 'text-blue-600',
        iconComponent: IoAlert,
    },
} as const;

export const BASE_STYLES = {
    container: 'px-6 py-4 shadow-lg font-satoshi flex items-center gap-3 border text-base rounded-lg transition-all duration-300 transform',
    icon: 'text-2xl flex-shrink-0',
};