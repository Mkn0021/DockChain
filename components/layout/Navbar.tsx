import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '../ui/Button';

export const Navbar: React.FC = () => {
    return (
        <div className="navbar" role="banner">
            <div className="navbar_container">
                <Link href="/" className="navbar_logo-link">
                    <Image src="/assets/logo.svg" alt="logo" height={28} width={120} className="navbar-logo" />
                </Link>
                <div className="navbar_buttons">
                    <Button variant="secondary" href="#how-it-works" className="navbar-btn">
                        How It Works?
                    </Button>
                    <Button variant="primary" href="/login">
                        Login
                    </Button>
                </div>
            </div>
        </div>
    );
};
