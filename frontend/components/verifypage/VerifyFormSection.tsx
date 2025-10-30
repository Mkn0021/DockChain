import InputBox from "@/components/_ui/InputBox";
import InfoBox from "../../../components/dashboard/InfoBox";
import { VERIFY_INSTRUCTIONS } from "../(data)";
import { Button } from "@/components/_ui/Button";
import { useState } from "react";

interface VerifyFormSectionProps {
    onSubmit?: (data: { link?: string; templateId?: string; documentHash?: string }) => void;
}

const VerifyFormSection: React.FC<VerifyFormSectionProps> = ({ onSubmit }) => {
    const [templateId, setTemplateId] = useState("");
    const [documentHash, setDocumentHash] = useState("");
    const [link, setLink] = useState("");
    const [manual, setManual] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (onSubmit) {
            if (manual) {
                onSubmit({ templateId, documentHash });
            } else {
                onSubmit({ link });
            }
        }
    };

    return (
        <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
            {!manual ? (
                <>
                    <InputBox
                        label="Verification Link"
                        placeholder="Paste verification link here"
                        value={link}
                        onChange={e => setLink(e.target.value)}
                        className=""
                    />
                    <InfoBox
                        items={VERIFY_INSTRUCTIONS.filter(inst => inst.key === "link").map(inst => inst.details)}
                        className="mt-2"
                    />
                    <div className="flex items-center justify-center mt-2">
                        <span className="text-gray-500 text-sm">Can't find the link?</span>
                        <button
                            type="button"
                            className="ml-2 text-primary font-semibold hover:underline text-sm"
                            onClick={() => setManual(true)}
                        >
                            Enter data manually
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <InputBox
                        label="Template ID"
                        placeholder="Enter Template ID"
                        value={templateId}
                        onChange={e => setTemplateId(e.target.value)}
                        className=""
                    />
                    <InputBox
                        label="Document Hash"
                        placeholder="Enter Document Hash"
                        value={documentHash}
                        onChange={e => setDocumentHash(e.target.value)}
                        className=""
                    />
                    <InfoBox
                        items={VERIFY_INSTRUCTIONS.filter(inst => inst.key === "manual").map(inst => inst.details)}
                        className="mt-2"
                    />
                    <div className="flex items-center justify-center mt-2">
                        <span className="text-gray-500 text-sm">Have a verification link?</span>
                        <button
                            type="button"
                            className="ml-2 text-primary font-semibold hover:underline text-sm"
                            onClick={() => setManual(false)}
                        >
                            Paste link
                        </button>
                    </div>
                </>
            )}
            <Button variant="primary" type="submit" className="w-full mt-2">
                Verify
            </Button>
        </form>
    );
};

export default VerifyFormSection;
