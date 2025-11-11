"use client";

import axios from "axios";
import Image from "next/image";
import ApiClient from "@/lib/api-client";
import { useState, useEffect } from "react";
import { DOCUMENT_ACTION_BUTTONS } from "@/data/dashboard.data";
import { useAlert } from "@/components/providers/AlertProvider";

interface QRBuffer {
    qrCode: string;
    url: string;
}

interface SuccessStepProps {
    documentId: string;
    renderedDocument: string | null;
    onNewDocument: () => void;
}

export default function SuccessStep({
    documentId,
    renderedDocument,
    onNewDocument,
}: SuccessStepProps) {
    const [qrImage, setQrImage] = useState<string | null>(null);
    const [qrUrl, setQrUrl] = useState<string | null>(null);
    const { showAlert } = useAlert();

    useEffect(() => {
        async function fetchQr() {
            if (!documentId) return;
            try {
                const response = await ApiClient.get(
                    `/documents/${documentId}/qr`
                );
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

    async function downloadPdf() {
        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/documents/${documentId}/pdf`, // Direct backend call
                { renderedDocument },
                {
                    responseType: "blob",
                    withCredentials: true,
                }
            );

            const blob = response.data;
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `document_${documentId}.pdf`;
            link.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            showAlert(`Download failed: ${error}`, "error");
        }
    }

    async function handleActions(action: string) {
        if (action == "copy" && qrUrl) {
            await navigator.clipboard.writeText(qrUrl);
            showAlert("QR URL copied to clipboard!", "success");
        } else if (action == "finish") {
            onNewDocument();
        } else if (action == "download" && renderedDocument) {
            showAlert("Download process started", "info");
            await downloadPdf();
        }
    }

    return (
        <div className="flex w-full max-w-lg flex-col items-center justify-center gap-2 text-center">
            <div className="rounded-md border-2 p-4">
                {qrImage ? (
                    <Image
                        src={qrImage}
                        alt="Document QR Code"
                        width={200}
                        height={200}
                        unoptimized
                    />
                ) : (
                    <div className="justify flex h-[128px] w-[128px] items-center bg-gray-200">
                        QR not available
                    </div>
                )}
            </div>
            <div className="flex w-full items-center justify-center py-6">
                <div className="flex gap-8">
                    {DOCUMENT_ACTION_BUTTONS.map((button) => (
                        <div
                            key={button.key}
                            className="flex cursor-pointer flex-col items-center"
                            onClick={() => handleActions(button.key)}
                        >
                            <button.Icon className="h-6 w-6 rounded-none text-border-dark" />
                            <span className="mt-2 text-sm">{button.title}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
