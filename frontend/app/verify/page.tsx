"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/_ui/Button";
import { Navbar } from "@/components/_ui/Navbar";
import LoadingSpinner from "@/components/_ui/LoadingSpinner";
import blockchainAnimation from "@/public/assets/blockchain.json";
import VerifyFormSection from "@/components/verifypage/VerifyFormSection";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function VerifyPage() {
    return (
        <main className="min-h-screen">
            <Navbar className="dark">
                <Button variant="secondary" href="/">
                    Home
                </Button>
                <Button variant="primary" href="/login">
                    Login
                </Button>
            </Navbar>
            <section className="mx-auto flex min-h-[70vh] w-full max-w-5xl flex-col items-center justify-center gap-16 px-4 py-12 lg:flex-row">
                {/* Left: Form */}
                <div className="flex w-full flex-col items-center lg:w-1/2">
                    <div className="flex w-full max-w-lg flex-col items-center rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
                        <h3>Verify Document</h3>
                        <Suspense fallback={<LoadingSpinner />}>
                            <VerifyFormSection />
                        </Suspense>
                    </div>
                </div>
                {/* Right: Lottie Animation */}
                <div className="hidden h-full w-1/2 items-center justify-center lg:flex">
                    <div className="flex h-[32rem] w-full max-w-xl items-center justify-center">
                        <Lottie
                            autoplay
                            loop
                            animationData={blockchainAnimation}
                            style={{ height: "100%", width: "100%" }}
                        />
                    </div>
                </div>
            </section>
        </main>
    );
}
