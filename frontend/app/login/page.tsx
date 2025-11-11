import { BsCheckCircle } from "react-icons/bs";
import { FEATURE_LIST } from "@/data/loginpage.data";
import AuthForm from "@/components/loginpage/AuthForm";

export default function LoginPage() {
    return (
        <main className="align-center mx-auto my-auto flex h-full w-full max-w-7xl overflow-hidden py-12 lg:gap-8 xl:gap-12">
            {/* Left Side - Auth Form */}
            <div className="flex h-full w-full items-center justify-center lg:w-1/2">
                <AuthForm />
            </div>
            {/* Right Side - Feature List */}
            <div className="my-auto hidden h-full w-1/2 flex-col items-center justify-center lg:flex">
                <div className="w-full">
                    <h2 className="mb-6 self-start text-left text-3xl text-white xl:text-4xl">
                        Start Issuing Verified and Immutable Records
                    </h2>
                    {FEATURE_LIST.map((feature, idx) => (
                        <div key={idx} className="mb-3 flex items-center gap-2">
                            <BsCheckCircle size={24} className="text-accent" />
                            <h4 className="m-0 p-0 text-base text-accent xl:text-lg">
                                {feature}
                            </h4>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
