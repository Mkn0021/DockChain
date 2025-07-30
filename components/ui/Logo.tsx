import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface LogoProps {
    className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = '' }) => {
    return (
        <Link href="/" className="m-0 p-0">
            <Image
                src="/assets/logo.svg"
                alt="logo"
                height={24}
                width={100}
                className={className}
                priority
            />
        </Link>
    );
};

export default Logo;
