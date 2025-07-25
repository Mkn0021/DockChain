import React from 'react';
import Image from 'next/image';

export const HowItWorksSection: React.FC = () => {
  return (
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
  );
};
