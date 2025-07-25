import React from 'react';

interface TestimonialCardProps {
  title: string;
  description: string;
  className?: string;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  title,
  description,
  className = '',
}) => {
  return (
    <div className={className.trim()}>
      <p className="content-title">{title}</p>
      <p className="content-description">{description}</p>
    </div>
  );
};
