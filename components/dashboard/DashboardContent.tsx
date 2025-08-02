import type { User } from '@/types/user';
import { SignOutButton } from './SignOutButton';

interface DashboardContentProps {
  user: User;
}

export function DashboardContent({ user }: DashboardContentProps) {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <SignOutButton />
          </div>

          <div className="bg-blue-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-blue-900 mb-4">Welcome Back!</h2>
            <p className="text-blue-700">
              Hello {user.name}, you are successfully logged in to DockChain.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
