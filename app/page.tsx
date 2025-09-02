import { Navbar } from '@/components/layout/Navbar';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { FeatureCard } from '@/components/home-page/FeatureCard';
import SocialIcon from '@/components/ui/SocialIcon';
import Logo from '@/components/ui/Logo';
import Image from 'next/image';

export default function Home() {
  const heroImages = [
    {
      src: '/assets/key-features.avif',
      width: 200,
      height: 150,
      alt: 'Key Features',
      className: 'aspect-auto',
      position: 'z-10 w-[21%] absolute left-[0%] bottom-[30%] hidden md:block'
    },
    {
      src: '/assets/dashboard.avif',
      width: 707,
      height: 400,
      alt: 'Dashboard',
      className: 'aspect-auto w-full',
      position: 'flex align-center justify-center md:px-6'
    },
    {
      src: '/assets/hero-image-mobile.avif',
      width: 235,
      height: 300,
      alt: '',
      className: 'aspect-auto',
      position: 'w-[21.5%] absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-6 hidden md:block'
    }
  ];

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
      <header className="dark">
        <Navbar>
          <Button variant="secondary" href="#how-it-works">
            How It Works?
          </Button>
          <Button variant="primary" href="/login">
            Login
          </Button>
        </Navbar>
      </header>

      {/* Hero Section */}
      <Section>
        <div className="dark w-full max-w-3xl flex flex-col items-center gap-6 sm:gap-8">
          {/* Just to Maintain linebreak of h5: 3xl is  used*/}
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

      {/* Testimonials Section */}
      <Section>
        <h2 className="text-left self-start">Verifiable credentials adoption worldwide</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-background-muted p-8">
              <h4 className="mt-0" role="heading" aria-level={3}>{testimonial.title}</h4>
              <p className="text-text-secondary">{testimonial.description}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Footer Section */}
      <footer>
        <Section className="dark bg-background-dark rounded-bl-none rounded-br-none">
          {/* Top part */}
          <div className="w-full flex flex-col sm:flex-row sm:justify-between sm:items-center">
            <h3 className="mb-6 sm:mb-0 text-center sm:text-left">
              Ready to get started?
            </h3>
            <div className="flex justify-center sm:justify-start">
              <Button variant="primary" href="/login">Sign up</Button>
              <Button variant="secondary" href="/verify">Verify a Document</Button>
            </div>
          </div>

          {/* Divider */}
          <hr className="w-full border-t border-border my-8"></hr>

          {/* Bottom part */}
          <div className="w-full flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6">
            <div className="flex items-center gap-4 justify-center sm:justify-start">
              <Logo className='hidden sm:block' />
              <p className="text-sm text-center sm:text-left">
                © 2025 Blockchain-Based Document Verification
              </p>
            </div>

            <div className="flex gap-4 justify-center sm:justify-end">
              <SocialIcon platform="telegram" username="mkn0021" />
              <SocialIcon platform="youtube" username="mkn0021" />
              <SocialIcon platform="twitter" username="mkn0021" />
              <SocialIcon platform="github" username="mkn0021" />
              <SocialIcon platform="discord" username="mkn0021" />
              <SocialIcon platform="linkedin" username="mkn0021" />
            </div>
          </div>
        </Section>
      </footer>
    </main>
  );
}
