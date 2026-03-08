import { auth } from '@/server/auth/auth';
import { prisma } from '@/server/db/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, CreditCard, Info, Phone } from 'lucide-react';
import ReservationButton from './ReservationButton';

export default async function RoomDetailPage({
  params: paramsPromise,
}: {
  params: Promise<{ id: string }>;
}) {
  const params = await paramsPromise;
  const session = await auth();

  if (!session) {
    redirect(`/login?redirect=/rooms/${params.id}`);
  }

  const room = await prisma.room.findUnique({
    where: { id: params.id },
  });

  if (!room) {
    redirect('/rooms');
  }

  // Check if user already has a reservation
  const existingReservation = await prisma.reservation.findFirst({
    where: {
      customerId: session.user.id,
      status: { in: ['RESERVED', 'CHECKED_IN'] },
    },
  });

  if (existingReservation) {
    redirect('/');
  }

  return (
    <div className="bg-surface text-primary-dark min-h-screen px-4 py-12 font-sans sm:px-6">
      <div className="mx-auto max-w-3xl space-y-8">
        <Link
          href="/rooms"
          className="text-primary-dark/40 hover:text-accent-color inline-flex items-center gap-2 text-sm font-bold transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Daftar Kamar
        </Link>

        <div className="bg-warm-surface border-primary-dark/10 overflow-hidden rounded-[40px] border shadow-xl">
          <div className="bg-primary-dark/5 relative flex aspect-video items-center justify-center overflow-hidden">
            {room.imageUrl ? (
              <img
                src={room.imageUrl}
                alt={`Kamar ${room.number}`}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <span className="text-primary-dark/5 text-9xl font-black italic select-none">
                {room.number}
              </span>
            )}
            <div className="from-warm-surface absolute inset-0 bg-gradient-to-t to-transparent opacity-40" />
            <div className="absolute bottom-8 left-8">
              <h1 className="text-primary-dark text-3xl font-black tracking-tighter italic sm:text-4xl">
                Kamar {room.number}
              </h1>
              <p className="text-primary-dark/60 mt-2 inline-block rounded-full border border-white bg-white/50 px-3 py-1 text-[10px] font-medium tracking-widest uppercase backdrop-blur-sm">
                {room.category}
              </p>
            </div>
          </div>

          <div className="space-y-10 p-8 md:p-12">
            <section className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="space-y-4">
                <h2 className="text-primary-dark/30 text-sm font-black tracking-widest uppercase">
                  Detail & Fasilitas
                </h2>
                <div className="flex flex-wrap gap-2">
                  {room.facilities?.split(',').map((f, i) => (
                    <div
                      key={i}
                      className="border-primary-dark/5 rounded-2xl border bg-white px-4 py-2 text-sm font-bold shadow-sm"
                    >
                      {f.trim()}
                    </div>
                  )) || (
                    <span className="text-primary-dark/30 text-sm italic">
                      Fasilitas standar
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-col justify-center rounded-[32px] border border-[#F4E7D3] bg-[#F9F8ED]/50 p-6">
                <p className="mb-1 text-[10px] font-black tracking-widest text-[#0881A3] uppercase">
                  Total Biaya Bulanan
                </p>
                <div className="text-3xl font-black text-[#1F4E5F]">
                  Rp {room.priceMonthly.toLocaleString('id-ID')}
                </div>
              </div>
            </section>

            <div className="bg-primary-dark/10 h-px" />

            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="bg-accent-color/10 text-accent-color flex h-10 w-10 items-center justify-center rounded-2xl">
                  <Info className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-black italic">
                  Instruksi Reservasi
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="border-primary-dark/5 space-y-3 rounded-3xl border bg-white p-6">
                  <div className="text-primary-dark flex items-center gap-2 text-sm font-black">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    1. Konfirmasi Data
                  </div>
                  <p className="text-primary-dark/50 text-xs leading-relaxed font-medium">
                    Pastikan pilihan kamarmu sudah sesuai. Data reservasi akan
                    tercatat secara otomatis.
                  </p>
                </div>
                <div className="border-primary-dark/5 space-y-3 rounded-3xl border bg-white p-6">
                  <div className="text-primary-dark flex items-center gap-2 text-sm font-black">
                    <CreditCard className="text-accent-color h-4 w-4" />
                    2. Pembayaran
                  </div>
                  <p className="text-primary-dark/50 text-xs leading-relaxed font-medium">
                    Lakukan transfer sesuai nominal ke rekening admin yang
                    muncul setelah klik tombol di bawah.
                  </p>
                </div>
              </div>

              <ReservationButton roomId={room.id} />
            </section>
          </div>
        </div>

        <div className="border-primary-dark/5 flex items-center gap-4 rounded-[32px] border bg-white/50 p-6">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <Phone className="h-6 w-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold">Butuh Bantuan?</h4>
            <p className="text-primary-dark/40 text-xs font-medium">
              Hubungi Admin di +62 812-3456-7890 jika ada kendala saat
              reservasi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
