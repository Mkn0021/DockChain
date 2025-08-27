import { BsCheck } from "react-icons/bs";
import { Button } from '@/components/ui/Button';
import { MdNavigateNext } from "react-icons/md";

interface Step {
    title: string;
    description: string;
}

interface StepperProps {
    steps: Step[];
    current: number;
    setCurrent: (step: number) => void;
    children: React.ReactNode;
}

const StepperLayout: React.FC<StepperProps> = ({ steps, current, setCurrent, children }) => {
    return (
        <div>
            <div className="flex items-center justify-between w-full">
                {steps.map((step, i) => {
                    const isCompleted = i < current;
                    const isActive = i === current;
                    const isLast = i === steps.length - 1;

                    return (
                        <div key={i} className={`flex items-center pb-4 border-b border-border rounded-none ${isLast ? '' : 'flex-1'}`}>
                            {/* Circle */}
                            <div
                                className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${isCompleted || isActive
                                    ? "bg-primary text-white"
                                    : "bg-gray-200 text-text-secondary"
                                    }`}
                            >
                                {isCompleted ? <BsCheck size={24} /> : i + 1}
                            </div>

                            {/* Label */}
                            {!isCompleted && <span className={`ml-2 ${isActive ? 'text-text-primary block' : 'text-text-secondary hidden sm:block'} whitespace-nowrap`}>{step.title}</span>}

                            {/* Connector */}
                            {!isLast && (
                                <div
                                    className={`flex-1 border-t mx-2 ${isCompleted ? "border-primary" : "border-border"
                                        }`}
                                ></div>
                            )}
                        </div>
                    );
                })}
            </div>
            {/* Header and Sub-header */}
            <div className="py-6">
                <h3 className="text-left m-0 p-0">{steps[current].title}</h3>
                <p className="text-text-secondary">{steps[current].description}</p>
            </div>
            {/* Children (step content) */}
            <div className="flex-1 flex flex-col justify-center items-center h-72 rounded-none">
                {children}
            </div>
            {/* Buttons at the bottom */}
            <div className="flex items-center justify-between pt-2">
                <Button
                    variant='secondary'
                    onClick={() => setCurrent(Math.max(current - 1, 0))}
                    disabled={current === 0}
                >
                    <MdNavigateNext size={24} className="rotate-180" />
                </Button>
                <Button
                    onClick={() => setCurrent(Math.min(current + 1, steps.length - 1))}
                    disabled={current === steps.length - 1}
                >
                    <MdNavigateNext size={24} />
                </Button>
            </div>
        </div>
    );
}

export default StepperLayout;
