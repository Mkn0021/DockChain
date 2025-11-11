"use client";

import ApiClient from "@/lib/api-client";
import { useState, useEffect } from "react";
import { MdNavigateNext } from "react-icons/md";
import { Button } from "@/components/_ui/Button";
import { useAlert } from "@/components/providers/AlertProvider";
import { useStepper } from "@/components/dashboard/StepperLayout";
import { Template, TemplateSelectionStepProps } from "@/types/template.type";

export default function SelectionStep({
    selectedTemplate,
    onSelectTemplate,
}: TemplateSelectionStepProps) {
    const [allTemplates, setAllTemplates] = useState<Template[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const { showAlert } = useAlert();
    const { setCanGoToNextStep, setMiddleContent } = useStepper();
    const limit = 3;

    useEffect(() => {
        setCanGoToNextStep(!!selectedTemplate);
    }, [selectedTemplate, setCanGoToNextStep]);

    useEffect(() => {
        const startPage = Math.max(1, currentPage - 1);
        const endPage = Math.min(totalPages, currentPage + 1);
        const pageButtons = Array.from(
            { length: endPage - startPage + 1 },
            (_, i) => startPage + i
        ).map((page) => (
            <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`rounded px-3 py-1 text-sm ${
                    page === currentPage
                        ? "bg-primary text-white"
                        : "text-text-secondary hover:bg-background-muted"
                }`}
            >
                {page}
            </button>
        ));

        const pagination = (
            <div className="flex items-center gap-1">
                <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="rounded p-2 text-text-secondary hover:bg-background-muted disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <MdNavigateNext size={36} className="rotate-180" />
                </button>
                {pageButtons}
                <button
                    onClick={() =>
                        setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="rounded p-2 text-text-secondary hover:bg-background-muted disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <MdNavigateNext size={36} />
                </button>
            </div>
        );
        setMiddleContent(pagination);
        return () => setMiddleContent(null);
    }, [currentPage, totalPages, setMiddleContent]);

    useEffect(() => {
        async function fetchTemplates() {
            try {
                const response = await ApiClient.get("/templates/");

                if (!response.success) {
                    throw new Error(
                        response.error || "Failed to fetch templates"
                    );
                }
                const data = response.data as {
                    templates: Template[];
                    total: number;
                    pages: number;
                };
                setAllTemplates(data.templates);
                setTotalPages(Math.ceil(data.total / limit));
            } catch (error) {
                showAlert(`Error fetching templates: ${error}`, "error");
            }
        }
        fetchTemplates();
    }, [showAlert]);

    const templates = allTemplates.slice(
        (currentPage - 1) * limit,
        currentPage * limit
    );

    return (
        <div className="h-auto w-full overflow-x-auto overflow-y-auto rounded-none lg:h-72 lg:overflow-y-hidden">
            <div className="flex h-full flex-col items-center gap-6 py-2 lg:flex-row">
                {templates.length === 0 ? (
                    <div className="flex h-full w-full flex-col items-center justify-center text-center">
                        <h4 className="m-0 p-0">No templates available.</h4>
                        <p>Please upload a template to get started.</p>
                    </div>
                ) : (
                    templates.map((template) => (
                        <div
                            key={template.id}
                            className={`group relative flex h-auto w-full flex-col overflow-hidden rounded-lg border border-border bg-background-muted p-2 shadow-md transition-all duration-300 lg:h-full lg:w-96 ${
                                selectedTemplate?.id === template.id
                                    ? "border-2 border-primary"
                                    : ""
                            }`}
                        >
                            <div
                                className="flex w-full items-center justify-center overflow-hidden rounded-lg transition-all duration-100 group-hover:pointer-events-none group-hover:hidden group-hover:opacity-0 [&_svg]:h-auto [&_svg]:max-h-full [&_svg]:w-auto [&_svg]:max-w-full [&_svg]:rounded-lg"
                                dangerouslySetInnerHTML={{
                                    __html: template.svgTemplate,
                                }}
                            />
                            <div className="hidden h-full w-full flex-col items-center justify-center gap-4 text-center group-hover:flex">
                                <div>
                                    <h4 className="m-0 p-0">
                                        {" "}
                                        {template.name}
                                    </h4>
                                    <p>
                                        {template.description ||
                                            "No description provided."}
                                    </p>
                                </div>
                                <Button
                                    onClick={() => onSelectTemplate(template)}
                                >
                                    Use This
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
