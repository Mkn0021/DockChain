"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import { IoCheckmarkCircle, IoCloseCircle, IoAlert } from "react-icons/io5";

export type AlertType = 'success' | 'error' | 'info';

interface Alert {
    type: AlertType;
    message: string;
}

interface AlertContextProps {
    showAlert: (message: string, type?: AlertType) => void;
}

const AlertContext = createContext<AlertContextProps | undefined>(undefined);

export const useAlert = () => {
    const ctx = useContext(AlertContext);
    if (!ctx) throw new Error('useAlert must be used within AlertProvider');
    return ctx;
};

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [alert, setAlert] = useState<Alert | null>(null);
    const [visible, setVisible] = useState(false);
    const timerRef = React.useRef<NodeJS.Timeout | null>(null);

    const showAlert = useCallback((message: string, type: AlertType = 'info') => {
        setAlert({ message, type });
        setVisible(true);
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            setVisible(false);
            setTimeout(() => setAlert(null), 350);
        }, 3000);
    }, []);

    return (
        <AlertContext.Provider value={{ showAlert }}>
            {children}
            <div className={`fixed top-8 right-4 z-50 transition-transform duration-300 ${visible ? 'translate-x-0' : 'translate-x-full'} pointer-events-none`}>
                {alert && (
                    <div className={`px-6 py-4 shadow-lg font-satoshi flex items-center gap-3 border border-border text-base
                            ${alert.type === 'success' ? 'bg-green-50 text-green-700' : alert.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'}`}
                    >
                        {alert.type === 'success' && <IoCheckmarkCircle className="text-green-600 text-2xl" />}
                        {alert.type === 'error' && <IoCloseCircle className="text-red-600 text-2xl" />}
                        {alert.type === 'info' && <IoAlert className="text-blue-600 text-2xl" />}
                        <span className="whitespace-pre-line leading-tight">{alert.message}</span>
                    </div>
                )}
            </div>
        </AlertContext.Provider>
    );
};
