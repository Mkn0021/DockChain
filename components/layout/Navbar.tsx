import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '../ui/Button';

export const Navbar = () => {
    return (
        <div className="m-0 text-center flex justify-between items-center w-full px-6 py-8 md:px-12 lg:px-20 shadow-none h-[100px] relative">
            <Link href="/" className="m-0 p-0">
                <Image src="/assets/logo.svg" alt="logo" height={24} width={100} />
            </Link>
            <div className="hidden md:flex gap-4">
                <Button variant="secondary" href="#how-it-works">
                    How It Works?
                </Button>
                <Button variant="primary" href="/login">
                    Login
                </Button>
            </div>
        </div>
    );
};

