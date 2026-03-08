'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  CreditCard,
  CheckCircle2,
  XCircle,
  Clock,
} from 'lucide-react';
import PaymentsSkeleton from '@/components/skeletons/PaymentsSkeleton';

const statusConfig: Record<
  string,
  { label: string; className: string; icon: React.ElementType }
> = {
  CONFIRMED: {
    label: 'Dikonfirmasi',
    className: 'bg-emerald-100 text-emerald-700',
    icon: CheckCircle2,
  },
  REJECTED: {
    label: 'Ditolak',
    className: 'bg-red-100 text-red-600',
    icon: XCircle,
  },
  PENDING: {
    label: 'Menunggu',
    className: 'bg-amber-100 text-amber-700',
    icon: Clock,
  },
};

export default function PaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/public/payments')
      .then((r) => r.json())
      .then((data) => setPayments(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <PaymentsSkeleton />;
  }

  return (
    <div className="bg-surface text-primary-dark min-h-screen px-4 py-12 pb-6 font-sans sm:px-6">
      <div className="mx-auto max-w-2xl space-y-8">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="border-primary-dark/10 flex h-10 w-10 items-center justify-center rounded-2xl border bg-white transition-all hover:border-transparent hover:bg-[#0881A3] hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-black italic">Riwayat Pembayaran</h1>
            <p className="text-primary-dark/40 text-sm font-medium">
              Semua catatan pembayaranmu
            </p>
          </div>
        </div>

        {payments.length === 0 ? (
          <div className="flex flex-col items-center space-y-3 rounded-[40px] border-2 border-dashed border-[#F4E7D3] bg-white p-16 text-center">
            <CreditCard className="text-primary-dark/10 h-10 w-10" />
            <p className="text-primary-dark font-black">
              Belum ada riwayat pembayaran
            </p>
            <p className="text-primary-dark/40 text-sm">
              Pembayaran akan muncul di sini setelah kamu melakukan reservasi.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {payments.map((payment) => {
              const cfg = statusConfig[payment.status] ?? statusConfig.PENDING;
              const StatusIcon = cfg.icon;
              return (
                <div
                  key={payment.id}
                  className="flex items-center gap-6 rounded-[32px] border border-[#F4E7D3] bg-white p-6 shadow-sm"
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#F9F8ED] text-[#0881A3]">
                    <CreditCard className="h-7 w-7" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-base font-black text-[#1F4E5F]">
                        Kamar {payment.reservation?.room?.number ?? '-'}
                      </p>
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black tracking-wide uppercase ${cfg.className}`}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {cfg.label}
                      </span>
                    </div>
                    <p className="mt-1 text-xl font-black text-[#1F4E5F]">
                      Rp {payment.amount.toLocaleString('id-ID')}
                    </p>
                    <p className="text-primary-dark/40 mt-1 text-xs font-medium">
                      {new Date(payment.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                      {payment.confirmedAt &&
                        ` · Dikonfirmasi ${new Date(payment.confirmedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}`}
                    </p>
                  </div>
                  {payment.proofUrl && (
                    <a
                      href={payment.proofUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-[#F4E7D3] transition-colors hover:border-[#0881A3]"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={payment.proofUrl}
                        alt="Bukti"
                        className="h-full w-full object-cover"
                      />
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
