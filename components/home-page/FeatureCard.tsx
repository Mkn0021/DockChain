import React from 'react';
import Image from 'next/image';

interface FeatureCardProps {
  imageSrc: string;
  imageAlt: string;
  title: string;
  description: string;
  className?: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  imageSrc,
  imageAlt,
  title,
  description,
  className = '',
}) => {
  return (
    <div className={`feature-card ${className}`.trim()}>
      <div className="feature-image card-gradient">
        <Image src={imageSrc} alt={imageAlt} width={300} height={200} />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};
