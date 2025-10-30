import { FaCopy, FaDownload, FaCheck } from "react-icons/fa";

export const ISSUING_INSTRACTIONS = [
    "Review the rendered document before issuing.",
    "To edit any value, go to the previous step and update the fields."
];

export const ACTION_BUTTONS = [
    { key: 'copy', Icon: FaCopy, title: 'Copy URL' },
    { key: 'download', Icon: FaDownload, title: 'Download' },
    { key: 'finish', Icon: FaCheck, title: 'Finish' }
];