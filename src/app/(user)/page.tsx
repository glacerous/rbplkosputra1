'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import PublicLandingView from '@/components/home/PublicLandingView';
import LoggedInNoRoomView from '@/components/home/LoggedInNoRoomView';
import PendingPaymentView from '@/components/home/PendingPaymentView';
import UserDashboardView from '@/components/home/UserDashboardView';
import CleanerDashboardView from '@/components/home/CleanerDashboardView';
import { Loader2 } from 'lucide-react';
import { Role, Reservation } from '@prisma/client';

interface CustomUser {
  id: string;
  name?: string | null;
  email?: string | null;
  role: Role;
}

export default function Home() {
  const { data: session, status } = useSession();
  const [activeReservation, setActiveReservation] = useState<Record<string, unknown> | null>(null);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (status === 'authenticated' && !hasFetched) {
      // Defer state update to avoid cascading renders
      Promise.resolve().then(() => setHasFetched(true));
      if ((session?.user as unknown as CustomUser)?.role === 'CLEANER') {
        return;
      }
      fetch('/api/public/leases/active')
        .then((res) => res.json())
        .then((data) => {
          setActiveReservation(data);
          setHasFetched(true);
        })
        .catch(() => setHasFetched(true));
    } else if (status === 'unauthenticated' && !hasFetched) {
      Promise.resolve().then(() => setHasFetched(true));
    }
  }, [status, session, hasFetched]);

  if (status === 'loading' || (!hasFetched && status !== 'unauthenticated')) {
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

  if (hasFetched && (session?.user as unknown as CustomUser)?.role === 'CLEANER') {
    return <CleanerDashboardView name={name} />;
  }

  if (!activeReservation) {
    return <LoggedInNoRoomView name={name} />;
  }

  if (activeReservation?.status === 'RESERVED') {
    return <PendingPaymentView reservation={activeReservation as unknown as Reservation} name={name} />;
  }

  return <UserDashboardView reservation={activeReservation as unknown as Reservation} name={name} />;
}
