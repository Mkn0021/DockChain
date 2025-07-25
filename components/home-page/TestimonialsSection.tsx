import React from 'react';
import { TestimonialCard } from '../home-page/TestimonialCard';

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      title: 'California prepares to issue birth, marriage and death certificates as VCs',
      description: 'In 2022, the state of California adopted legislation to issue citizens\' vital records using blockchain and Verifiable Credentials to streamline administrative processes, reduce fraud, and empower individuals.',
    },
    {
      title: 'Utah funds program to issue VCs using blockchain',
      description: 'The pilot program focuses on preventing the unauthorized alteration of electronic records and securing private information for uses cases such as age verification.',
    },
    {
      title: 'LinkedIn launches VC-based workplace verifications',
      description: 'Enables employers to verify employee\'s workplace to ensure authenticity and trust. By using open standards, these credentials can be used to verify employment on other platforms such as ATSs and HR systems.',
    },
  ];

  return (
    <section className="section">
      <div className="padding-global">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Verifiable credentials adoption worldwide</h2>
          </div>
          <div className="grid grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card card-light">
                <TestimonialCard
                  title={testimonial.title}
                  description={testimonial.description}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
