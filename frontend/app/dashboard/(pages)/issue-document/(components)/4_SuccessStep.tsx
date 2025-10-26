"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/Button';
import ApiClient from '@/lib/api-client';

interface SuccessStepProps {
    documentId: string;
    renderedDocument: string | null;
    onNewDocument: () => void;
}

export default function SuccessStep({ documentId, renderedDocument, onNewDocument }: SuccessStepProps) {
    const [qrUrl, setQrUrl] = useState<string | null>(null);

    useEffect(() => {
        async function fetchQr() {
            if (!documentId) return;
            try {
                const response = await ApiClient.get(`/documents/${documentId}/qr`);
                if (!response.success) {
                    setQrUrl(null);
                    return;
                }

                const byteArray = new Uint8Array((response.data as any).data);
                const blob = new Blob([byteArray], { type: 'image/png' });
                setQrUrl(URL.createObjectURL(blob));
            } catch {
                setQrUrl(null);
            }
        }
        fetchQr();
    }, [documentId]);

    function downloadDocument(svgString: string) {
        try {
            const svgBlob = new Blob([svgString], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(svgBlob);

            const img = new window.Image();
            img.onload = function () {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.drawImage(img, 0, 0);
                    canvas.toBlob((blob) => {
                        if (blob) {
                            const filename = `document_template.png`;
                            const link = document.createElement('a');
                            link.href = URL.createObjectURL(blob);
                            link.download = filename;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                        }
                    }, 'image/png');
                }
                URL.revokeObjectURL(url);
            };
            img.src = url;
        } catch (error) {
            console.error(`Error downloading PNG: ${error}`, 'error');
        }
    }
    return (
        <div className="flex flex-col items-center justify-center w-full max-w-lg text-center gap-2">
            <div className="mb-4">
                {qrUrl ? (
                    <img src={qrUrl} alt="Document QR Code" width={128} height={128} />
                ) : (
                    <div className="w-[128px] h-[128px] bg-gray-200 flex items-center justify">QR not available</div>
                )}
            </div>
            <h4 className="text-primary m-0 p-0">Document Issued!</h4>
            <p>Your document has been issued successfully. The issued document is securely stored and can be verified on the blockchain.</p>
            <div className="flex w-full justify-center items-center py-6">
                <Button
                    onClick={() =>
                        renderedDocument &&
                        downloadDocument(renderedDocument)
                    }
                >
                    Download Document
                </Button>
                <Button variant="secondary" onClick={onNewDocument}>Issue Another Document</Button>
            </div>
        </div>
    );
}