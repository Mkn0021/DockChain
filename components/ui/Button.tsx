import Link from 'next/link';
import clsx from 'clsx';

type ButtonProps = {
  children: React.ReactNode;
  className?: string;
  href: string;
  variant?: 'primary' | 'secondary';
};

export const Button: React.FC<ButtonProps> = ({ children, href, variant = 'primary', className }) => {
  return (
    <Link
      href={href}
      className={clsx(
        'text-center px-6 py-4 text-base font-medium leading-6 transition-all duration-150 no-underline m-2',
        'hover:bg-gray-50 hover:text-zinc-900 hover:-translate-y-1',
        'active:outline active:outline-primary active:outline-offset-[3px] active:outline-2',
        variant === 'primary' && 'bg-primary text-white',
        variant === 'secondary' && 'border border-white text-white self-center',
        className
      )}
    >
      {children}
    </Link>
  );
};