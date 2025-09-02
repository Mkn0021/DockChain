"use client";

import { MdVerified } from 'react-icons/md';
import { Button } from '@/components/ui/Button';
import { useAlert } from "@/components/providers/AlertProvider";

interface SuccessStepProps {
    selectedTemplateId: string;
    renderedDocument: string | null;
    onNewDocument: () => void;
}

export default function SuccessStep({ selectedTemplateId, renderedDocument, onNewDocument }: SuccessStepProps) {
    const { showAlert } = useAlert();

    function downloadSvgAsPng(svgString: string, templateId: string) {
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
                            // Filename includes templateId as metadata
                            const filename = `document_template_${templateId}.png`;
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
            showAlert(`Error downloading PNG: ${error}`, 'error');
        }
    }
    return (
        <div className="flex flex-col items-center justify-center w-full max-w-lg text-center gap-2">
            <MdVerified size={96} className="text-blue-700 mb-2" />
            <h4 className="text-primary m-0 p-0">Document Issued!</h4>
            <p>Your document has been issued successfully.The issued document is securely stored and can be verified on the blockchain.</p>
            <div className="flex w-full justify-center items-center py-6">
                <Button
                    onClick={() =>
                        renderedDocument && selectedTemplateId &&
                        downloadSvgAsPng(renderedDocument, selectedTemplateId)
                    }
                >
                    Download Document
                </Button>
                <Button variant="secondary" onClick={onNewDocument}>Issue Another Document</Button>
            </div>
        </div>
    );
}