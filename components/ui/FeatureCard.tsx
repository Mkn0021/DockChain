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
    <div className={`feature-item ${className}`.trim()}>
      <div className="feature-img-container">
        <Image src={imageSrc} alt={imageAlt} className="feature-img" width={300} height={200} />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};
