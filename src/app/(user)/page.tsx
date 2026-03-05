"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import PublicLandingView from "@/components/home/PublicLandingView";
import LoggedInNoRoomView from "@/components/home/LoggedInNoRoomView";
import PendingPaymentView from "@/components/home/PendingPaymentView";
import UserDashboardView from "@/components/home/UserDashboardView";

export default function Home() {
  const { data: session, status } = useSession();
  const [activeReservation, setActiveReservation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/public/leases/active")
        .then((res) => res.json())
        .then((data) => {
          setActiveReservation(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else if (status === "unauthenticated") {
      setLoading(false);
    }
  }, [status]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-[#F9F8ED] flex items-center justify-center font-['Balsamiq_Sans'] text-[#1F4E5F]">
        <div className="font-bold">Memuat...</div>
      </div>
    );
  }

  if (!session) {
    return <PublicLandingView />;
  }

  if (!activeReservation) {
    return <LoggedInNoRoomView />;
  }

  if (activeReservation.status === "RESERVED") {
    return <PendingPaymentView reservation={activeReservation} />;
  }

  return <UserDashboardView reservation={activeReservation} />;
}
