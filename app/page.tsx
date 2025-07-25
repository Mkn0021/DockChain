import { Navbar } from '@/components/layout/Navbar';
import { HeroSection } from '@/components/home-page/HeroSection';
import { WhyBlockchainSection } from '@/components/home-page/WhyBlockchainSection';
import { HowItWorksSection } from '@/components/home-page/HowItWorksSection';
import { TestimonialsSection } from '@/components/home-page/TestimonialsSection';
import { Footer } from '@/components/home-page/Footer';

export default function Home() {
  return (
    <div className="home-page">
      <main className="main-wrapper">
        <header className="header">
          <Navbar />
          <HeroSection />
        </header>
        <WhyBlockchainSection />
        <HowItWorksSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </div>
  );
}
