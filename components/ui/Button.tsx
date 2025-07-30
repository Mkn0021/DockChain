import React from 'react';
import clsx from 'clsx';

type ButtonProps = {
  children: React.ReactNode;
  className?: string;
  href?: string;
  variant?: 'primary' | 'secondary';
  type?: 'button' | 'submit' | 'reset';
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export const Button: React.FC<ButtonProps> = ({
  children,
  href,
  variant = 'primary',
  className,
  type = 'button',
  onClick,
}) => {
  const baseClasses = clsx(
    'text-center px-6 py-4 text-base font-medium leading-6 transition-all duration-150 no-underline m-2',
    'hover:bg-primary-hover hover:text-white hover:-translate-y-1',
    'dark:hover:bg-gray-50 dark:hover:text-zinc-900',
    'active:outline active:outline-primary active:outline-offset-[3px] active:outline-2',
    variant === 'primary' && 'bg-primary dark:bg-primary-dark text-white',
    variant === 'secondary' && 'border border-primary dark:border-white text-primary dark:text-white self-center',
    className
  );

  if (href) {
    return (
      <a href={href} className={baseClasses}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} className={baseClasses} onClick={onClick}>
      {children}
    </button>
  );
};