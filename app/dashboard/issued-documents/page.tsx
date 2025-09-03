"use client";

import { useEffect, useState } from "react";
import { useAlert } from "@/components/providers/AlertProvider";
import { APIError } from "@/lib/api/errors";
import { IssuedDocument } from "@/types/document";
import FormInput from "@/components/ui/FormInput";
import { IoSearch } from "react-icons/io5";


export default function IssuedDocumentsPage() {
    const [documents, setDocuments] = useState<IssuedDocument[] | null>(null);
    const [search, setSearch] = useState("");
    const { showAlert } = useAlert();

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const res = await fetch('/api/documents');
                if (!res.ok) throw new APIError('Failed to fetch documents API');
                const response: { data: { documents: IssuedDocument[] } } = await res.json();
                setDocuments(response.data.documents || []);
                console.log('Fetched documents:', response.data.documents);
            } catch (error) {
                showAlert(`Error fetching documents: ${error}`, 'error');
            }
        }

        fetchDocuments();
    }, [showAlert])

    const filteredDocuments = documents?.filter(doc =>
        [doc.recipientName, doc.templateName, doc.status, new Date(doc.createdAt).toLocaleDateString()]
            .some(field => field.toLowerCase().includes(search.toLowerCase()))
    ) || [];

    const header = [
        {
            title: "Name / Email",
            data: filteredDocuments.map(doc => doc.recipientName) || []
        },
        {
            title: "Document",
            data: filteredDocuments.map(doc => doc.templateName) || []
        },
        {
            title: "Status",
            data: filteredDocuments.map(doc => doc.status) || []
        },
        {
            title: "Issued At",
            data: filteredDocuments.map(doc => new Date(doc.createdAt).toLocaleDateString()) || []
        }
    ]

    return (
        <div className="flex flex-col items-center justify-center w-full gap-12">
            <div className="relative w-full max-w-md self-start">
                <FormInput
                    className="w-full pl-10"
                    placeholder="Search issued documents..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
                    <IoSearch size={24} />
                </span>
            </div>

            <div className="w-full flex items-center justify-center border-2 border-border overflow-hidden">
                <table className="w-full">
                    <thead className="text-text-feature text-lg md:text-xl border-b-2 border-border">
                        <tr>
                            {header.map((col) => (
                                <th key={col.title} className="px-2 py-4">{col.title}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredDocuments && filteredDocuments.length > 0 && filteredDocuments.map((doc, idx) => (
                            <tr key={doc.id || idx} className={idx % 2 == 0 ? 'bg-background-muted' : ''}>
                                {header.map((col, colIdx) => (
                                    <td key={col.title + colIdx} className={`text-center px-2 py-4 rounded-none max-w-xs truncate overflow-hidden break-words whitespace-normal ${colIdx !== 0 ? 'border-l border-border' : ''}`}>
                                        {col.data[idx]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        {filteredDocuments.length === 0 && (
                            <tr>
                                <td colSpan={header.length} className="text-center py-8 text-gray-500">
                                    No documents found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
