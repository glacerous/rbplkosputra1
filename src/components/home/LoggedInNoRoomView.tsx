import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Image from 'next/image';

interface Room {
  id: string;
  number: string;
  category: string;
  priceMonthly: number;
  imageUrl?: string | null;
  facilities?: string | null;
}

export default function LoggedInNoRoomView({ name }: { name: string }) {
  const [recommendations, setRecommendations] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/public/rooms?status=AVAILABLE')
      .then((res) => res.json())
      .then((data) => {
        setRecommendations(data.slice(0, 2));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="bg-surface text-primary-dark pb-safe-bottom min-h-screen">
      <div className="mx-auto max-w-md px-6 pt-8 text-center sm:pt-12">
        <div className="flex justify-end p-4">
          <button
            onClick={() => signOut()}
            className="bg-primary-dark/5 border-primary-dark/10 flex items-center gap-2 rounded-lg border px-4 py-2 text-[12px] font-bold transition-all hover:bg-white hover:text-red-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5"
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
            Logout
          </button>
        </div>

        <div className="bg-accent-color/10 border-accent-color/20 mb-6 inline-block rounded-full border p-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="text-accent-color h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
        </div>

        <header className="mb-10">
          <h1 className="mb-3 px-4 text-[32px] leading-tight font-bold tracking-tight">
            Halo, {name}!
          </h1>
          <p className="text-primary-dark/70 text-[16px] leading-relaxed font-normal">
            Mari temukan kamar untukmu.
          </p>
        </header>

        <section className="mb-10 space-y-4 text-left">
          <h2 className="mb-4 text-center text-[16px] font-bold tracking-widest uppercase opacity-40">
            Rekomendasi Kamar
          </h2>
          {loading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-24 w-full animate-pulse rounded-xl bg-warm-surface border border-primary-dark/5" />
              ))}
            </div>
          ) : recommendations.length === 0 ? (
            <p className="text-primary-dark/30 text-center text-sm italic">Belum ada kamar yang tersedia saat ini.</p>
          ) : (
            recommendations.map((room) => (
              <div
                key={room.id}
                className="bg-warm-surface border-primary-dark/10 hover:bg-warm-surface/80 flex items-center gap-4 rounded-xl border p-4 shadow-sm transition-colors"
              >
                <div className="bg-primary-dark/5 border-primary-dark/5 relative h-16 w-16 overflow-hidden rounded-lg border">
                  {room.imageUrl ? (
                    <Image src={room.imageUrl} alt={room.number} fill className="object-cover" />
                  ) : (
                    <span className="caption text-primary-dark/20 text-center leading-none font-bold">
                      {room.number}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="text-primary-dark text-[16px] font-bold">
                    Kamar {room.number} {room.category}
                  </div>
                  <div className="caption text-primary-dark/50">
                    Siap huni • {room.facilities?.split(',')[0] || 'Standar'}
                  </div>
                </div>
                <div className="text-accent-color text-[16px] font-bold">
                  Rp {(room.priceMonthly / 1000000).toFixed(1)}jt
                </div>
              </div>
            ))
          )}
        </section>

        <p className="caption text-primary-dark/30 mt-8 mb-4 px-8">
          Klik tombol di bawah untuk melihat semua daftar kamar yang tersedia.
        </p>
      </div>

      {/* Sticky Bottom Booking Bar */}
      <div className="bg-surface/90 border-primary-dark/10 fixed right-0 bottom-0 left-0 z-50 border-t p-4 backdrop-blur-md">
        <div className="mx-auto max-w-md">
          <Link
            href="/rooms"
            className="bg-accent-color block w-full rounded-xl py-4 text-center text-[16px] font-bold text-white shadow-lg transition-all active:scale-[0.98]"
          >
            Booking Kamar Sekarang
          </Link>
        </div>
      </div>
    </div>
  );
}
