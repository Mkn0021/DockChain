import Image from "next/image";
import Logo from "@/components/_ui/Logo";
import { Button } from "@/components/_ui/Button";
import { Navbar } from "@/components/_ui/Navbar";
import { Section } from "../../components/homepage/Section";
import SocialIcon from "../../components/homepage/SocialIcon";
import { FeatureCard } from "../../components/homepage/FeatureCard";
import {
    HERO_IMAGES,
    TESTIMONIALS,
    WHY_BLOCKCHAIN,
} from "@/data/homepage.data";

export default function HomePage() {
    return (
        <main>
            <Navbar className="dark">
                <Button variant="secondary" href="#how-it-works">
                    How It Works?
                </Button>
                <Button variant="primary" href="/login">
                    Login
                </Button>
            </Navbar>

            {/* Hero Section */}
            <Section>
                <div className="dark flex w-full max-w-3xl flex-col items-center gap-6 sm:gap-8">
                    <div className="flex max-w-full flex-col items-center text-center">
                        <h4>#1 Blockchain-Based Document Platform</h4>
                        <h1>
                            Verify and Issue Documents Securely with Blockchain
                        </h1>
                        <p className="mb-lg  whitespace-break-spaces text-base md:text-lg">
                            Streamline document verification and issuance using
                            secure blockchain technology. Enable users to verify
                            and issue documents with full transparency and
                            trust.
                        </p>
                    </div>
                    <div className="mt-2 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row sm:gap-4">
                        <Button
                            variant="primary"
                            href="/login"
                            className="w-[80%] sm:w-auto"
                        >
                            Issue Document
                        </Button>
                        <Button
                            variant="secondary"
                            href="/verify"
                            className="w-[80%] sm:w-auto"
                        >
                            Verify Document
                        </Button>
                    </div>
                </div>
                <div className="relative w-full max-w-6xl">
                    {HERO_IMAGES.map((image, index) => (
                        <div key={index} className={image.position}>
                            <Image
                                src={image.src}
                                loading="eager"
                                width={image.width}
                                height={image.height}
                                className={image.className}
                                alt={image.alt}
                            />
                        </div>
                    ))}
                </div>
            </Section>

            {/* Why Blockchain Section */}
            <Section>
                <h2 className="self-start text-left">Why Choose Blockchain?</h2>
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-8">
                    {WHY_BLOCKCHAIN.map((feature, index) => (
                        <FeatureCard
                            key={index}
                            imageSrc={feature.imageSrc}
                            imageAlt={feature.imageAlt}
                            title={feature.title}
                            description={feature.description}
                        />
                    ))}
                </div>
            </Section>

            {/* How It Works Section */}
            <Section>
                <div
                    id="how-it-works"
                    className="dark flex w-full flex-col gap-12 bg-background-dark p-20"
                >
                    <div className="self-start text-left">
                        <h2>Blockchain-Based Verification</h2>
                        <p>API + WEB APP + NFC CARD</p>
                    </div>
                    <Image
                        src="/assets/how-it-works.webp"
                        loading="lazy"
                        alt="How it works"
                        width={800}
                        height={600}
                        className="h-auto w-full object-cover"
                    />
                </div>
            </Section>

            {/* Testimonials Section */}
            <Section>
                <h2 className="self-start text-left">
                    Verifiable credentials adoption worldwide
                </h2>
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-8">
                    {TESTIMONIALS.map((testimonial, index) => (
                        <div key={index} className="bg-background-muted p-8">
                            <h4 className="mt-0" role="heading" aria-level={3}>
                                {testimonial.title}
                            </h4>
                            <p className="text-text-secondary">
                                {testimonial.description}
                            </p>
                        </div>
                    ))}
                </div>
            </Section>

            {/* Footer Section */}
            <footer>
                <Section className="dark rounded-bl-none rounded-br-none bg-background-dark">
                    {/* Top part */}
                    <div className="flex w-full flex-col sm:flex-row sm:items-center sm:justify-between">
                        <h3 className="mb-6 text-center sm:mb-0 sm:text-left">
                            Ready to get started?
                        </h3>
                        <div className="flex justify-center sm:justify-start">
                            <Button variant="primary" href="/login">
                                Sign up
                            </Button>
                            <Button variant="secondary" href="/verify">
                                Verify a Document
                            </Button>
                        </div>
                    </div>

                    {/* Divider */}
                    <hr className="my-8 w-full border-t border-border"></hr>

                    {/* Bottom part */}
                    <div className="flex w-full flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center justify-center gap-4 sm:justify-start">
                            <Logo className="hidden sm:block" />
                            <p className="text-center text-sm sm:text-left">
                                © 2025 Blockchain-Based Document Verification
                            </p>
                        </div>

                        <div className="flex justify-center gap-4 sm:justify-end">
                            <SocialIcon
                                platform="telegram"
                                username="mkn0021"
                            />
                            <SocialIcon platform="youtube" username="mkn0021" />
                            <SocialIcon platform="twitter" username="mkn0021" />
                            <SocialIcon platform="github" username="mkn0021" />
                            <SocialIcon platform="discord" username="mkn0021" />
                            <SocialIcon
                                platform="linkedin"
                                username="mkn0021"
                            />
                        </div>
                    </div>
                </Section>
            </footer>
        </main>
    );
}
