'use client';

import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import {
  Clock,
  CreditCard,
  LogOut,
  Upload,
  XCircle,
  Loader2,
  ImageIcon,
} from 'lucide-react';

interface Reservation {
  id: string;
  room?: {
    number: string;
    priceMonthly: number;
  };
  payments?: Array<{
    id: string;
    proofUrl?: string | null;
  }>;
}

interface PendingPaymentViewProps {
  reservation: Reservation;
  name: string;
}

export default function PendingPaymentView({
  reservation,
  name,
}: PendingPaymentViewProps) {
  const room = reservation.room;
  const latestPayment = reservation.payments?.[0];
  const router = useRouter();

  const [uploading, setUploading] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const handleCancel = async () => {
    if (!confirm('Yakin ingin membatalkan reservasi ini?')) return;
    setCancelling(true);
    try {
      const res = await fetch(
        `/api/public/reservations/${reservation.id}/cancel`,
        { method: 'PATCH' },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Gagal membatalkan');
      window.location.reload();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setCancelling(false);
    }
  };
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [proofUrl, setProofUrl] = useState<string | null>(
    latestPayment?.proofUrl ?? null,
  );
  const fileRef = useRef<HTMLInputElement>(null);

  // Poll every 8 seconds for status changes after proof is uploaded
  useEffect(() => {
    if (!proofUrl) return;

    const interval = setInterval(() => {
      router.refresh();
    }, 8000);

    return () => clearInterval(interval);
  }, [proofUrl, router]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('proof', file);

      if (!latestPayment?.id) throw new Error('Pembayaran tidak ditemukan');

      const res = await fetch(
        `/api/public/payments/${latestPayment.id}/proof`,
        {
          method: 'POST',
          body: formData,
        },
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Gagal mengunggah bukti');

      setProofUrl(data.proofUrl);
      router.refresh();
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-surface text-primary-dark flex min-h-screen items-center justify-center px-6 py-6 font-sans sm:py-0">
      <div className="w-full max-w-xl space-y-8">
        {/* Status Header */}
        <div className="border-primary-dark/5 relative space-y-6 overflow-hidden rounded-[40px] border bg-white p-8 shadow-2xl">
          <div className="absolute top-0 right-0 -mt-16 -mr-16 h-32 w-32 rounded-full bg-amber-500/5 blur-2xl" />

          <div className="flex items-center justify-between">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-500">
              <Clock className="h-8 w-8 animate-pulse" />
            </div>
            <button
              onClick={() => signOut()}
              className="text-primary-dark/30 transition-colors hover:text-red-500"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-2">
            <p className="text-primary-dark/40 text-sm font-medium">
              Hei, {name}
            </p>
            <h1 className="text-3xl font-black tracking-tighter italic">
              Reservasi Berhasil!
            </h1>
            <p className="text-primary-dark/50 font-medium">
              Kamar {room?.number} telah dititipkan untukmu. Unggah bukti
              transfer untuk diverifikasi admin.
            </p>
          </div>

          <div className="bg-primary-dark/5 h-px" />

          {/* Payment amount */}
          <div className="flex items-center gap-4 rounded-2xl border border-[#F4E7D3] bg-[#F9F8ED] p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#0881A3] shadow-sm">
              <CreditCard className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black tracking-widest text-[#0881A3] uppercase">
                Nominal Pembayaran
              </p>
              <p className="text-sm font-bold text-[#1F4E5F]">
                Rp {room?.priceMonthly?.toLocaleString('id-ID')}
              </p>
            </div>
          </div>

          {/* Payment instructions */}
          <div className="space-y-3">
            <p className="text-primary-dark/40 text-[10px] font-black tracking-widest uppercase">
              Cara Pembayaran
            </p>
            <ol className="space-y-2">
              {[
                `Transfer ke rekening ${process.env.NEXT_PUBLIC_PAYMENT_BANK_NAME ?? 'BCA'} ${process.env.NEXT_PUBLIC_PAYMENT_BANK_ACCOUNT ?? '1234567890'} a.n. ${process.env.NEXT_PUBLIC_PAYMENT_BANK_HOLDER ?? 'Kos Putra Friendly'}`,
                'Nominal sesuai tagihan di atas',
                'Upload bukti transfer pada kolom di bawah',
              ].map((step, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-sm text-[#1F4E5F]"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0881A3] text-[10px] font-black text-white">
                    {i + 1}
                  </span>
                  <span className="leading-5 font-medium">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="bg-primary-dark/5 h-px" />

          {/* Proof upload area */}
          <div className="space-y-3">
            <p className="text-primary-dark/40 text-[10px] font-black tracking-widest uppercase">
              Bukti Transfer
            </p>

            {proofUrl ? (
              <div className="space-y-3">
                <div className="relative overflow-hidden rounded-2xl border border-[#F4E7D3] bg-[#F9F8ED]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={proofUrl}
                    alt="Bukti transfer"
                    className="max-h-64 w-full object-contain"
                  />
                </div>
                <button
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-[#0881A3]/40 py-3 text-sm font-bold text-[#0881A3] transition-colors hover:bg-[#0881A3]/5 disabled:opacity-50"
                >
                  {uploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                  Ganti Bukti
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="flex w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-[#F4E7D3] bg-[#F9F8ED] py-10 transition-all duration-200 hover:border-[#0881A3]/40 hover:bg-[#0881A3]/5 disabled:opacity-50"
              >
                {uploading ? (
                  <Loader2 className="h-8 w-8 animate-spin text-[#0881A3]" />
                ) : (
                  <ImageIcon className="text-primary-dark/20 h-8 w-8" />
                )}
                <span className="text-primary-dark/40 text-sm font-bold">
                  {uploading
                    ? 'Mengunggah...'
                    : 'Klik untuk unggah bukti transfer'}
                </span>
                <span className="text-primary-dark/30 text-[10px]">
                  JPG, PNG, WebP • Maks 5MB
                </span>
              </button>
            )}

            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleUpload}
            />

            {uploadError && (
              <p className="flex items-center gap-2 text-sm font-medium text-red-500">
                <XCircle className="h-4 w-4" />
                {uploadError}
              </p>
            )}
          </div>

          <div className="bg-primary-dark/5 h-px" />

          <button
            onClick={handleCancel}
            disabled={cancelling}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-200 py-3 text-sm font-bold text-red-500 transition-colors hover:bg-red-50 disabled:opacity-50"
          >
            {cancelling ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <XCircle className="h-4 w-4" />
            )}
            Batalkan Reservasi
          </button>
        </div>

        {/* Waiting info */}
        <div className="relative overflow-hidden rounded-[40px] bg-[#1F4E5F] p-8 text-white shadow-xl">
          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[10px] font-black tracking-widest uppercase">
              <div className="h-1.5 w-1.5 animate-ping rounded-full bg-amber-500" />
              {proofUrl ? 'Menunggu Verifikasi' : 'Menunggu Bukti'}
            </div>
            <h2 className="text-2xl leading-tight font-black italic">
              {proofUrl
                ? 'Admin sedang memverifikasi\npembayaranmu.'
                : 'Unggah bukti transfer\nuntuk lanjut.'}
            </h2>
            <p className="max-w-[240px] text-[10px] font-medium text-white/40">
              {proofUrl
                ? 'Halaman ini akan otomatis diperbarui setelah admin melakukan approval.'
                : 'Setelah mengunggah bukti, admin akan segera memverifikasi pembayaranmu.'}
            </p>
          </div>
          <div className="absolute right-[-20%] bottom-[-20%] h-64 w-64 rounded-full bg-[#0881A3] opacity-20 blur-[80px]" />
        </div>
      </div>
    </div>
  );
}
