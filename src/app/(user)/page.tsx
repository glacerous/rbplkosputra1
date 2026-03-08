'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import PublicLandingView from '@/components/home/PublicLandingView';
import LoggedInNoRoomView from '@/components/home/LoggedInNoRoomView';
import PendingPaymentView from '@/components/home/PendingPaymentView';
import UserDashboardView from '@/components/home/UserDashboardView';
import HomePageSkeleton from '@/components/home/skeletons/HomePageSkeleton';

export default function Home() {
  const { data: session, status } = useSession();
  const [activeReservation, setActiveReservation] = useState<any>(null);
  const [loading, setLoading] = useState(status !== 'authenticated');

  useEffect(() => {
    if (status === 'authenticated') {
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
  }, [status]);

  if (status === 'loading' || loading) {
    return <HomePageSkeleton />;
  }

  if (!session) {
    return <PublicLandingView />;
  }

  const name = session.user.name ?? '';

  if (!activeReservation) {
    return <LoggedInNoRoomView name={name} />;
  }

  if (activeReservation.status === 'RESERVED') {
    return <PendingPaymentView reservation={activeReservation} name={name} />;
  }

  return <UserDashboardView reservation={activeReservation} name={name} />;
}
