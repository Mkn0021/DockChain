import Image from "next/image";
import { Button } from "@/components/Button";
import { Navbar } from "@/components/Navbar";
import { heroImages, features } from "./(data)";
import { Section } from "./(components)/Section";
import { FeatureCard } from "./(components)/FeatureCard";

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
        <div className="dark w-full max-w-3xl flex flex-col items-center gap-6 sm:gap-8">
          <div className="max-w-full flex flex-col items-center text-center">
            <h4>#1 Blockchain-Based Document Platform</h4>
            <h1>Verify and Issue Documents Securely with Blockchain</h1>
            <p className="whitespace-break-spaces  text-base md:text-lg mb-lg">
              Streamline document verification and issuance using secure blockchain technology.
              Enable users to verify and issue documents with full transparency and trust.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 mt-2 w-full sm:w-auto">
            <Button variant="primary" href="/login" className="w-[80%] sm:w-auto">
              Issue Document
            </Button>
            <Button variant="secondary" href="/verify" className="w-[80%] sm:w-auto">
              Verify Document
            </Button>
          </div>
        </div>
        <div className="w-full max-w-6xl relative">
          {heroImages.map((image, index) => (
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
        <h2 className="text-left self-start">Why Choose Blockchain?</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8">
          {features.map((feature, index) => (
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
        <div id="how-it-works" className="dark w-full bg-background-dark flex flex-col gap-12 p-20">
          <div className='text-left self-start'>
            <h2>Blockchain-Based Verification</h2>
            <p>API + WEB APP + NFC CARD</p>
          </div>
          <Image
            src="/assets/how-it-works.webp"
            loading="lazy"
            alt="How it works"
            width={800}
            height={600}
            className="w-full h-auto object-cover"
          />
        </div>
      </Section>
    </main>
  );
}
