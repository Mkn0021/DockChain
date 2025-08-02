import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { DashboardContent } from '@/components/dashboard/DashboardContent';

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  return <DashboardContent user={session.user} />;
}
