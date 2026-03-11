'use client';

import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  CreditCard,
  ChevronRight,
  LogOut,
  Loader2,
  User,
} from 'lucide-react';
import NotificationBell from '@/components/NotificationBell';
import MonthlyPaymentView from './MonthlyPaymentView';

function CountdownTimer({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  useEffect(() => {
    const calculate = () => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance < 0) {
        setTimeLeft(null);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        ),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    };

    calculate();
    const timer = setInterval(calculate, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) return <span className="text-red-500 font-bold">Jatuh Tempo!</span>;

  return (
    <div className="flex gap-2 text-[10px] font-black tracking-widest text-[#0881A3]">
      <div className="flex flex-col items-center">
        <span>{timeLeft.days}D</span>
      </div>
      <span>:</span>
      <div className="flex flex-col items-center">
        <span>{timeLeft.hours}H</span>
      </div>
      <span>:</span>
      <div className="flex flex-col items-center">
        <span>{timeLeft.minutes}M</span>
      </div>
      <span>:</span>
      <div className="flex flex-col items-center">
        <span>{timeLeft.seconds}S</span>
      </div>
    </div>
  );
}

interface UserDashboardViewProps {
  reservation: any;
  name: string;
}

export default function UserDashboardView({
  reservation,
  name,
}: UserDashboardViewProps) {
  const latestPayment = reservation.payments?.[0];
  const room = reservation.room;
  const router = useRouter();
  const [checkingOut, setCheckingOut] = useState(false);
  const [creatingPayment, setCreatingPayment] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);

  // Calculate next due date (monthly from check-in)
  const checkInDate = new Date(reservation.checkInAt || reservation.createdAt);
  const now = new Date();
  let nextDueDate = new Date(checkInDate);
  while (nextDueDate <= now) {
    nextDueDate.setMonth(nextDueDate.getMonth() + 1);
  }

  const handlePayBill = async () => {
    if (latestPayment?.status === 'PENDING') {
      setSelectedPayment(latestPayment);
      return;
    }
    if (latestPayment?.status === 'CONFIRMED' && !selectedPayment) {
      // Optional: maybe they want to see the confirmed one? 
      // But user said "bayar tagihan", so usually for pending/new ones.
      // However, let's allow viewing the latest if it's confirmed too?
      // Actually, let's stick to creating/showing pending.
    }

    setCreatingPayment(true);
    try {
      const res = await fetch('/api/public/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reservationId: reservation.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Gagal membuat tagihan');
      setSelectedPayment(data);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setCreatingPayment(false);
    }
  };

  if (selectedPayment) {
    return (
      <MonthlyPaymentView
        reservation={reservation}
        payment={selectedPayment}
        name={name}
        onBack={() => setSelectedPayment(null)}
      />
    );
  }

  const handleCheckout = async () => {
    if (
      !confirm('Anda yakin ingin melakukan checkout? Kamar akan dikosongkan.')
    )
      return;
    setCheckingOut(true);
    try {
      const res = await fetch(
        `/api/public/reservations/${reservation.id}/checkout`,
        {
          method: 'PATCH',
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Gagal checkout');
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setCheckingOut(false);
    }
  };

  return (
    <div className="bg-surface text-primary-dark min-h-screen w-full px-4 py-8 font-sans sm:px-6 sm:py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="mb-2 text-[32px] font-bold">Halo, {name}</h1>
              <p className="text-primary-dark/60 text-base font-normal">
                Kelola kamar dan detail masa tinggalmu.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <NotificationBell />
              <button
                onClick={() => signOut()}
                className="bg-primary-dark/5 border-primary-dark/10 flex items-center gap-2 rounded-xl border px-6 py-2 text-sm font-bold transition-all hover:bg-white hover:text-red-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Keluar
              </button>
            </div>
          </div>
          <div className="bg-warm-surface border-primary-dark/10 flex items-center gap-3 rounded-xl border p-4">
            <div className="bg-accent-color/10 flex h-10 w-10 items-center justify-center rounded-full">
              <div className="bg-accent-color h-2.5 w-2.5 animate-pulse rounded-full" />
            </div>
            <div>
              <div className="text-primary-dark/40 text-[12px] font-bold tracking-wide uppercase">
                Status Sewa
              </div>
              <div className="text-sm font-bold">Terdaftar & Aktif</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Room Info */}
          <div className="bg-warm-surface border-primary-dark/10 col-span-1 rounded-xl border p-6 shadow-sm md:col-span-2">
            <h3 className="mb-6 flex items-center gap-2 text-base font-bold">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="text-accent-color h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10.496 2.132a1 1 0 00-.992 0l-7 4A1 1 0 003 8v7a1 1 0 001 1h12a1 1 0 001-1V8a1 1 0 00-.504-.868l-7-4zM5 14V8.4l5-2.857 5 2.857V14H5z"
                  clipRule="evenodd"
                />
              </svg>
              Informasi Kamar
            </h3>
            <div className="flex flex-col gap-6 sm:flex-row">
              <div className="bg-primary-dark/5 border-primary-dark/5 relative aspect-video w-full overflow-hidden rounded-lg border sm:w-1/2">
                {room?.imageUrl ? (
                  <img
                    src={room.imageUrl}
                    alt={`Kamar ${room.number}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="text-primary-dark/20 flex h-full items-center justify-center text-sm italic">
                    Foto Kamar
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div className="space-y-4">
                  <div>
                    <div className="text-primary-dark/40 text-[12px] font-bold uppercase">
                      Nomor Kamar
                    </div>
                    <div className="text-xl font-bold">
                      Kamar {room?.number || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <div className="text-primary-dark/40 text-[12px] font-bold uppercase">
                      Tipe/Kategori
                    </div>
                    <div className="text-sm font-bold">
                      {room?.category || 'Standard'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Active Lease & Payment */}
          <div className="space-y-6">
            <div className="border-primary-dark/10 space-y-4 rounded-[32px] border bg-white p-6 shadow-sm">
              <h3 className="flex items-center gap-2 text-base font-black italic">
                <CreditCard className="h-5 w-5 text-[#0881A3]" />
                Tagihan & Pembayaran
              </h3>
              <div className="rounded-2xl border border-[#F4E7D3] bg-[#F9F8ED] p-4">
                <div className="mb-2 flex items-center justify-between">
                  <div className="text-[9px] font-black tracking-widest text-[#0881A3] uppercase">
                    Jatuh Tempo
                  </div>
                  <div className="text-[9px] font-bold text-[#1F4E5F]">
                    {nextDueDate.toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </div>
                </div>
                <div className="mb-3">
                  <CountdownTimer targetDate={nextDueDate} />
                </div>
                <div className="mb-1 flex items-center justify-between">
                  <div className="text-[9px] font-black tracking-widest text-[#0881A3] uppercase">
                    Status Terakhir
                  </div>
                  <div
                    className={`rounded-full px-2 py-0.5 text-[9px] font-black ${latestPayment?.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}
                  >
                    {latestPayment?.status || 'No Records'}
                  </div>
                </div>
                <div className="text-xl font-black text-[#1F4E5F]">
                  {latestPayment
                    ? `Rp ${latestPayment.amount.toLocaleString('id-ID')}`
                    : '-'}
                </div>
              </div>
              <button
                onClick={handlePayBill}
                disabled={creatingPayment}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-transparent bg-[#0881A3] py-3 text-center text-xs font-black tracking-widest text-white uppercase transition-all hover:border-[#0881A3] hover:bg-white hover:text-[#0881A3] disabled:opacity-50"
              >
                {creatingPayment ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CreditCard className="h-4 w-4" />
                )}
                Bayar Tagihan
              </button>
              <Link
                href="/payments"
                className="text-primary-dark/40 block w-full text-center text-[10px] font-bold uppercase transition-all hover:text-[#0881A3]"
              >
                Riwayat Pembayaran
              </Link>
            </div>

            <div className="group relative space-y-6 overflow-hidden rounded-[32px] bg-[#1F4E5F] p-6 text-white shadow-xl">
              <div className="relative z-10 space-y-4">
                <h3 className="flex items-center gap-2 text-base font-black italic">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-accent-color h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  Kelola Hunian
                </h3>
                <div className="space-y-3">
                  <Link
                    href="/profile"
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-3 transition-colors hover:bg-white/10"
                  >
                    <span className="flex items-center gap-2 text-sm font-bold">
                      <User className="h-4 w-4 text-white/50" />
                      Profil Saya
                    </span>
                    <ChevronRight className="h-4 w-4 text-white/30" />
                  </Link>
                  <Link
                    href="/complaints"
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-3 transition-colors hover:bg-white/10"
                  >
                    <span className="text-sm font-bold">Lapor Komplain</span>
                    <ChevronRight className="h-4 w-4 text-white/30" />
                  </Link>
                  <button
                    onClick={handleCheckout}
                    disabled={checkingOut}
                    className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-3 text-left transition-colors hover:border-red-500/30 hover:bg-red-500/20 disabled:opacity-50"
                  >
                    <span className="text-sm font-bold text-red-400">
                      Checkout Kamar
                    </span>
                    {checkingOut ? (
                      <Loader2 className="h-4 w-4 animate-spin text-red-400/60" />
                    ) : (
                      <LogOut className="h-4 w-4 text-red-400/30" />
                    )}
                  </button>
                </div>
              </div>
              <div className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-[#0881A3] opacity-20 blur-[60px]" />
            </div>
          </div>
        </div>

        <footer className="text-primary-dark/30 mt-12 text-center text-[12px] font-normal">
          &copy; 2026 Kos Putra Friendly• Layanan Tenant Terpadu
        </footer>
      </div>
    </div>
  );
}
