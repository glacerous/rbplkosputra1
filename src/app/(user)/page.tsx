'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import PublicLandingView from '@/components/home/PublicLandingView';
import LoggedInNoRoomView from '@/components/home/LoggedInNoRoomView';
import PendingPaymentView from '@/components/home/PendingPaymentView';
import UserDashboardView from '@/components/home/UserDashboardView';
import CleanerDashboardView from '@/components/home/CleanerDashboardView';
import { Loader2 } from 'lucide-react';
import { Role } from '@prisma/client';

interface CustomUser {
  id: string;
  name?: string | null;
  email?: string | null;
  role: Role;
}

export default function Home() {
  const { data: session, status } = useSession();
  const [activeReservation, setActiveReservation] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'authenticated') {
      if ((session?.user as unknown as CustomUser)?.role === 'CLEANER') {
        setLoading(false);
        return;
      }
      fetch('/api/public/leases/active')
        .then((res) => res.json())
        .then((data) => {
          setActiveReservation(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else if (status === 'unauthenticated') {
      setLoading(false);
    }
  }, [status, session]);

  if (status === 'loading' || loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F9F8ED]">
        <Loader2 className="h-12 w-12 animate-spin text-[#0881A3]" />
      </div>
    );
  }

  if (!session) {
    return <PublicLandingView />;
  }

  const name = session.user.name ?? '';

  if (!loading && (session?.user as unknown as CustomUser)?.role === 'CLEANER') {
    return <CleanerDashboardView name={name} />;
  }

  if (!activeReservation) {
    return <LoggedInNoRoomView name={name} />;
  }

  if (activeReservation?.status === 'RESERVED') {
    return <PendingPaymentView reservation={activeReservation as any} name={name} />;
  }

  return <UserDashboardView reservation={activeReservation as any} name={name} />;
}
