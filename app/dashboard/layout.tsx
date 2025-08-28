import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { AlertProvider } from '@/components/providers/AlertProvider';

export default async function DashboardLayoutWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect('/login');
    }

    return (
        <DashboardLayout user={session.user}>
            <AlertProvider>
                {children}
            </AlertProvider>
        </DashboardLayout>
    );
}
