import React from 'react';
import { FeatureCard } from './FeatureCard';

export const WhyBlockchainSection: React.FC = () => {
  const features = [
    {
      imageSrc: '/assets/why-blockchain-1.webp',
      imageAlt: 'Feature 1',
      title: 'Accelerate customer onboarding',
      description: 'Improve conversion rates by allowing customers to bypass repeated data entry and physical document submission to verify their identity faster.',
    },
    {
      imageSrc: '/assets/why-blockchain-2.webp',
      imageAlt: 'Feature 2',
      title: 'Create a network of verifiers',
      description: 'Enable companies to issue ID credentials and expand your market reach by generating demand for that high-quality, verified ID data from a new market of verifiers.',
    },
    {
      imageSrc: '/assets/why-blockchain-3.webp',
      imageAlt: 'Feature 3',
      title: 'Lead the way with eIDAS and mDLs',
      description: 'The emergence of digital ID wallets and documents, underpinned by the eIDAS and mobile driver\'s licenses (mDLs), is redefining how we manage our identities.',
    },
  ];

  return (
    <section className="section">
      <div className="padding-global">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why Choose Blockchain?</h2>
          </div>
          <div className="grid grid-cols-3">
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
        </div>
      </div>
    </section>
  );
};
