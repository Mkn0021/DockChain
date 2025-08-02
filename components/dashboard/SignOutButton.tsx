"use client"

import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/Button';

export function SignOutButton() {
  const handleSignOut = () => {
    signOut({ callbackUrl: '/login' });
  };

  return (
    <Button onClick={handleSignOut} variant="secondary">
      Sign Out
    </Button>
  );
}
