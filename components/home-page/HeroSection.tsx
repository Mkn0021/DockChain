import React from 'react';
import Image from 'next/image';
import { Button } from '../ui/Button';

export const HeroSection: React.FC = () => {
  return (
    <div className="padding-hero">
      <div className="container">
        <div className="hero-section">
          <div className="hero-text">
            <div className="hero-tag">#1 Blockchain-Based Document Platform</div>
            <h1>Verify and Issue Documents Securely with Blockchain</h1>
          </div>
          <div className="hero-description">
            <p>
              Streamline document verification and issuance using secure blockchain technology. 
              Enable users to verify and issue documents with full transparency and trust.
            </p>
          </div>
          <div className="hero-buttons">
            <Button variant="primary" href="/login">
              Issue Document
            </Button>
            <Button variant="secondary" href="/verify">
              Verify Document
            </Button>
          </div>
        </div>
        <div className="header141_image-group">
          <div className="header141_image-wrapper2">
            <Image 
              src="/assets/key-features.avif" 
              loading="eager"
              width={200} 
              height={150}
              className="header141_image2" 
              alt="Key Features"
            />
          </div>
          <div className="header141_image-wrapper1">
            <Image 
              src="/assets/dashboard.avif" 
              loading="eager"
              width={707} 
              height={400}
              className="header141_image1" 
              alt="Dashboard"
            />
          </div>
          <div className="header141_image-wrapper3">
            <Image 
              src="/assets/hero-image-mobile.avif" 
              loading="eager"
              width={235} 
              height={300}
              alt="" 
              className="header141_image3"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
