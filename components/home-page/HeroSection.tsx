import React from 'react';
import Image from 'next/image';
import { Button } from '../ui/Button';

export const HeroSection: React.FC = () => {
  return (
    <div className="w-full flex flex-col items-center px-4 py-16 md:px-12 lg:px-24 bg-transparent">
      <div className="flex flex-col items-center w-full gap-12">
        <div className="w-full max-w-[900px] flex flex-col items-center gap-8">
          <div className="max-w-full flex flex-col items-center">
            <div className="text-xl text-white my-4 text-center">#1 Blockchain-Based Document Platform</div>
            <h1 className="text-3xl md:text-5xl font-bold text-center text-white mb-2">Verify and Issue Documents Securely with Blockchain</h1>
            <div className="text-gray-300 text-lg leading-relaxed mb-10 text-center whitespace-pre-line max-w-2xl mx-auto">
              Streamline document verification and issuance using secure blockchain technology.
              Enable users to verify and issue documents with full transparency and trust.
            </div>
          </div>
          <div className="flex justify-center items-center gap-4 mt-2">
            <Button variant="primary" href="/login">
              Issue Document
            </Button>
            <Button variant="secondary" href="/verify">
              Verify Document
            </Button>
          </div>
        </div>
        <div className="w-full max-w-[1200px] flex relative justify-center my-16 md:my-24 mx-auto">
          <div className="z-10 w-[21%] absolute left-[5%] bottom-[30%]">
            <Image
              src="/assets/key-features.avif"
              loading="eager"
              width={200}
              height={150}
              className="aspect-auto"
              alt="Key Features"
            />
          </div>
          <div className="w-4/5 mx-[10%]">
            <Image
              src="/assets/dashboard.avif"
              loading="eager"
              width={707}
              height={400}
              className="aspect-auto"
              alt="Dashboard"
            />
          </div>
          <div className="w-[21.5%] absolute right-0 top-[9%]">
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
