import { Navbar } from '@/components/layout/Navbar';
import { HeroSection } from '@/components/home-page/HeroSection';
import { Section } from '@/components/home-page/Section';
import { Button } from '@/components/ui/Button';
import { FeatureCard } from '@/components/home-page/FeatureCard';
import { TestimonialCard } from '@/components/home-page/TestimonialCard';
import SocialIcon from '@/components/ui/SocialIcon';
import Image from 'next/image';

export default function Home() {
  const features = [
    {
      imageSrc: '/assets/why-blockchain-1.webp',
      imageAlt: 'Feature 1',
      title: 'Fast Customer Onboarding',
      description: 'Improve conversion rates by allowing customers to bypass repeated data entry and physical document submission with blockchain-powered identity verification.',
    },
    {
      imageSrc: '/assets/why-blockchain-2.webp',
      imageAlt: 'Feature 2',
      title: 'Create Network of Verifiers',
      description: 'Enable companies to issue ID credentials and expand your market reach by generating demand for high-quality, verified ID data from a new market of trusted verifiers.',
    },
    {
      imageSrc: '/assets/why-blockchain-3.webp',
      imageAlt: 'Feature 3',
      title: 'Lead with eIDAS and mDLs',
      description: 'The emergence of digital ID wallets and documents, underpinned by the eIDAS and mobile driver\'s licenses (mDLs), is redefining how we manage our digital identities.',
    },
  ];

  const testimonials = [
    {
      title: 'California prepares to issue birth, marriage and death certificates as VCs',
      description: 'In 2022, the state of California adopted legislation to issue citizens\' vital records using blockchain and Verifiable Credentials to streamline administrative processes, reduce fraud, and empower individuals.',
    },
    {
      title: 'Utah funds program to issue VCs using blockchain',
      description: 'The pilot program focuses on preventing the unauthorized alteration of electronic records and securing private information for uses cases such as age verification.',
    },
    {
      title: 'LinkedIn launches VC-based workplace verifications',
      description: 'Enables employers to verify employee\'s workplace to ensure authenticity and trust. By using open standards, these credentials can be used to verify employment on other platforms such as ATSs and HR systems.',
    },
  ];

  return (
    <main>
      {/* Header Section */}
      <header className="header">
        <Navbar />
      </header>

      {/* Hero Section */}
      <HeroSection />

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
        <section className="section">
          <div className="padding-global">
            <div className="section-content">
              <div id="how-it-works" className="card card-dark verification-section">
                <h2>Blockchain-Based Verification</h2>
                <div className="section-subtitle">API + WEB APP + NFC CARD</div>
                <div>
                  <Image
                    src="/assets/how-it-works.webp"
                    loading="lazy"
                    alt="How it works"
                    width={800}
                    height={600}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="section">
          <div className="padding-global">
            <div className="container">
              <div className="section-header">
                <h2 className="section-title">Verifiable credentials adoption worldwide</h2>
              </div>
              <div className="grid grid-cols-3">
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="card card-light">
                    <TestimonialCard
                      title={testimonial.title}
                      description={testimonial.description}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Footer Section */}
        <footer className="footer">
        <div className="padding-global">
          <div className="container">
            <div className="footer-container">
              <p className="footer-title">
                Ready to get started?
              </p>
              <div className="hero-buttons">
                <Button variant="primary" href="/login">
                  Sign up
                </Button>
                <Button variant="secondary" href="/verify">
                  Verify a Document
                </Button>
              </div>
            </div>
            <div className="divider"></div>
            <div className="footer-container">
              <div className="footer-copyright" id="Copyright">
                <a href="/">
                  <Image src="/assets/logo.svg" alt="logo" height={40} width={120} />
                </a>
                <p>
                  Copyright ©2024 Blockchain-Based Document Verification
                </p>
              </div>
              <div className="social-icons">
                <SocialIcon platform="telegram" username="mkn0021" />
                <SocialIcon platform="youtube" username="" />
                <SocialIcon platform="twitter" username="mkn0021" />
                <SocialIcon platform="github" username="mkn0021" />
                <SocialIcon platform="discord" username="mkn0021" />
                <SocialIcon platform="linkedin" username="mkn0021" />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
