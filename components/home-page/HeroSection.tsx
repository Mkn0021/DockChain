import React from 'react';
import Image from 'next/image';
import { Button } from '../ui/Button';

export const HeroSection: React.FC = () => {
  return (
    <div className="w-full flex flex-col items-center px-2 sm:px-4 py-10 bg-transparent">
      <div className="flex flex-col items-center w-full max-w-[90vw] gap-8 sm:gap-12">
        <div className="w-full max-w-[750px] flex flex-col items-center gap-6 sm:gap-8">
          {/* Just to Maintain linebreak of h5 750px is  used*/}
          <div className="max-w-full flex flex-col items-center text-center">
            <h4>#1 Blockchain-Based Document Platform</h4>
            <h1>Verify and Issue Documents Securely with Blockchain</h1>
            <h5>
              Streamline document verification and issuance using secure blockchain technology.
              Enable users to verify and issue documents with full transparency and trust.
            </h5>
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
        <div className="w-full max-w-[1200px] relative">
          <div className="z-10 w-[21%] absolute left-[0%] bottom-[30%] hidden md:block">
            <Image
              src="/assets/key-features.avif"
              loading="eager"
              width={200}
              height={150}
              className="aspect-auto"
              alt="Key Features"
            />
          </div>
          <div className="flex align-center justify-center md:px-6">
            <Image
              src="/assets/dashboard.avif"
              loading="eager"
              width={707}
              height={400}
              className="aspect-auto w-full"
              alt="Dashboard"
            />
          </div>
          <div className="w-[21.5%] absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-6 hidden md:block">
            <Image
              src="/assets/hero-image-mobile.avif"
              loading="eager"
              width={235}
              height={300}
              alt=""
              className="aspect-[8/16]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
