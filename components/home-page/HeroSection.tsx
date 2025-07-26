import React from 'react';
import Image from 'next/image';
import { Button } from '../ui/Button';

export const HeroSection: React.FC = () => {
  return (
    <div className="w-full flex flex-col items-center px-2 sm:px-4 py-10 bg-transparent">
      <div className="flex flex-col items-center w-full max-w-[90vw] gap-8 sm:gap-12">
        <div className="w-full max-w-[900px] flex flex-col items-center gap-6 sm:gap-8">
          <div className="max-w-full flex flex-col items-center">
            <div className="text-base xs:text-lg sm:text-xl text-white my-2 sm:my-4 text-center">#1 Blockchain-Based Document Platform</div>
            <h1 className="text-lg xs:text-2xl sm:text-3xl md:text-5xl font-bold text-center text-white mb-2 leading-tight">Verify and Issue Documents Securely with Blockchain</h1>
            <div className="text-gray-300 text-sm xs:text-base sm:text-lg leading-relaxed mb-6 sm:mb-10 text-center whitespace-pre-line max-w-xs xs:max-w-md sm:max-w-2xl mx-auto">
              Streamline document verification and issuance using secure blockchain technology.
              Enable users to verify and issue documents with full transparency and trust.
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 mt-2 w-full sm:w-auto">
            <Button variant="primary" href="/login" className="w-full sm:w-auto text-base sm:text-lg">
              Issue Document
            </Button>
            <Button variant="secondary" href="/verify" className="w-full sm:w-auto text-base sm:text-lg">
              Verify Document
            </Button>
          </div>
        </div>
        <div className="w-full max-w-[1200px] flex flex-col md:flex-row relative justify-center my-10 md:my-24 mx-auto items-center md:items-stretch scale-95 sm:scale-100 px-2 sm:px-0 py-6 sm:py-10 md:py-16 lg:py-20">
          <div className="z-10 w-[21%] absolute left-[5%] bottom-[30%] hidden md:block">
            <Image
              src="/assets/key-features.avif"
              loading="eager"
              width={200}
              height={150}
              className="aspect-auto"
              alt="Key Features"
            />
          </div>
          <div className="w-full md:w-4/5 mx-auto md:mx-[10%]">
            <Image
              src="/assets/dashboard.avif"
              loading="eager"
              width={707}
              height={400}
              className="aspect-auto"
              alt="Dashboard"
            />
          </div>
          <div className="w-[21.5%] absolute right-0 top-[9%] hidden md:block">
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
