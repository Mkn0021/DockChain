import React from 'react';
import Image from 'next/image';
import { Button } from '../ui/Button';
import { SocialIcons } from './SocialIcons';

export const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="padding-global">
        <div className="container">
          <div className="footer-container">
            <p className="footer-title">
              Ready to get started?
            </p>
            <div className="hero-buttons">
              <Button variant="primary" href="/login">
                Sign up
              </Button>
              <Button variant="secondary" href="/verify">
                Verify a Document
              </Button>
            </div>
          </div>
          <div className="divider"></div>
          <div className="footer-container">
            <div className="footer-copyright" id="Copyright">
              <a href="/">
                <Image src="/assets/logo.svg" alt="logo" height={40} width={120} />
              </a>
              <p>
                Copyright ©2024 Blockchain-Based Document Verification
              </p>
            </div>
            <SocialIcons />
          </div>
        </div>
      </div>
    </footer>
  );
};
