"use client";

import ApiClient from '@/lib/api-client';
import { useState, useEffect } from 'react';
import { DOCUMENT_ACTION_BUTTONS } from '@/data/dashboard.data';

interface QRBuffer {
    qrCode: string;
    url: string;
}

interface SuccessStepProps {
    documentId: string;
    renderedDocument: string | null;
    onNewDocument: () => void;
}

export default function SuccessStep({ documentId, renderedDocument, onNewDocument }: SuccessStepProps) {
    const [qrImage, setQrImage] = useState<string | null>(null);
    const [qrUrl, setQrUrl] = useState<string | null>(null);

    useEffect(() => {
        async function fetchQr() {
            if (!documentId) return;
            try {
                const response = await ApiClient.get(`/documents/${documentId}/qr`);
                if (!response.success) {
                    setQrImage(null);
                    return;
                }
                const { qrCode, url } = response.data as QRBuffer;
                setQrImage(`data:image/png;base64,${qrCode}`);
                setQrUrl(url ?? null);
            } catch {
                setQrImage(null);
            }
        }
        fetchQr();
    }, [documentId]);

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-lg text-center gap-2">
            <div className="border-2 p-4 rounded-md">
                {qrImage ? (
                    <img src={qrImage} alt="Document QR Code" width={200} height={200} />
                ) : (
                    <div className="w-[128px] h-[128px] bg-gray-200 flex items-center justify">QR not available</div>
                )}
            </div>
            <div className="flex w-full justify-center items-center py-6">
                <div className="flex gap-8">
                    {DOCUMENT_ACTION_BUTTONS.map(button => (
                        <div key={button.key} className="flex flex-col items-center cursor-pointer">
                            <button.Icon className="w-6 h-6 rounded-none text-border-dark" />
                            <span className="text-sm mt-2">{button.title}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}