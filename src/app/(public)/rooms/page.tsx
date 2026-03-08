'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import RoomsListSkeleton from '@/components/skeletons/RoomsListSkeleton';

interface Room {
  id: string;
  number: string;
  category: string;
  priceMonthly: number;
  facilities: string | null;
  status: string;
}

export default function RoomsPage() {
  const { data: session } = useSession();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/public/rooms')
      .then((res) => res.json())
      .then((data) => {
        setRooms(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <RoomsListSkeleton />;
  }

  return (
    <div className="bg-surface text-primary-dark min-h-screen px-4 py-8 font-sans sm:px-6 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <header className="mb-12 text-center">
          <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Pilih Kamarmu
          </h1>
          <p className="text-primary-dark/60 mx-auto max-w-2xl text-lg">
            Temukan hunian yang nyaman dan sesuai dengan kebutuhanmu. Gunakan
            fasilitas terbaik kami.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="group bg-warm-surface border-primary-dark/10 relative overflow-hidden rounded-2xl border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="bg-primary-dark/5 relative flex aspect-[16/10] items-center justify-center overflow-hidden">
                <span className="text-primary-dark/10 text-6xl font-black italic select-none">
                  {room.number}
                </span>
                <div className="from-warm-surface absolute inset-0 bg-gradient-to-t to-transparent opacity-60" />
                <div className="absolute top-4 right-4">
                  <span
                    className={`rounded-full px-3 py-1 text-[10px] font-bold tracking-wider uppercase ${
                      room.status === 'AVAILABLE'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {room.status === 'AVAILABLE' ? 'Tersedia' : 'Terisi'}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h2 className="mb-1 text-xl font-bold">
                      Kamar {room.number}
                    </h2>
                    <p className="text-primary-dark/50 text-sm font-medium">
                      {room.category}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-primary-dark/30 mb-1 text-[10px] leading-none font-bold tracking-widest uppercase">
                      Per Bulan
                    </div>
                    <div className="text-accent-color text-xl font-bold">
                      Rp {room.priceMonthly.toLocaleString('id-ID')}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {room.facilities?.split(',').map((f, i) => (
                      <span
                        key={i}
                        className="bg-surface border-primary-dark/5 text-primary-dark/60 rounded border px-2 py-1 text-[10px] font-medium"
                      >
                        {f.trim()}
                      </span>
                    )) || (
                      <span className="text-primary-dark/20 text-xs italic">
                        Fasilitas standar
                      </span>
                    )}
                  </div>

                  <Link
                    href={
                      room.status === 'AVAILABLE'
                        ? session
                          ? `/rooms/${room.id}`
                          : `/login?redirect=/rooms/${room.id}`
                        : '#'
                    }
                    onClick={(e) =>
                      room.status !== 'AVAILABLE' && e.preventDefault()
                    }
                    className={`block w-full rounded-xl border-2 py-3 text-center text-sm font-bold transition-all ${
                      room.status === 'AVAILABLE'
                        ? 'bg-accent-color border-accent-color hover:text-accent-color text-white hover:bg-white'
                        : 'bg-primary-dark/10 text-primary-dark/30 cursor-not-allowed border-transparent'
                    }`}
                  >
                    {room.status === 'AVAILABLE'
                      ? 'Booking Sekarang'
                      : 'Sudah Dipesan'}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {rooms.length === 0 && (
          <div className="bg-warm-surface border-primary-dark/20 rounded-2xl border border-dashed py-20 text-center">
            <p className="text-primary-dark/40 font-bold italic">
              Maaf, saat ini belum ada kamar yang terdaftar.
            </p>
          </div>
        )}

        <div className="mt-16 flex justify-center">
          <Link
            href="/"
            className="text-primary-dark/40 hover:text-accent-color flex items-center gap-2 text-sm font-bold transition-colors"
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
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
