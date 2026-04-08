'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Edit, Trash2, Home, Loader2, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Room {
  id: string;
  number: string;
  category: string;
  priceMonthly: number;
  facilities: string | null;
  imageUrl?: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function RoomDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await fetch(`/api/admin/rooms/${id}`);
        if (!res.ok) throw new Error('Kamar tidak ditemukan');
        const data = await res.json();
        setRoom(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Kamar tidak ditemukan');
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm('Apakah Anda yakin ingin menghapus kamar ini?')) return;

    try {
      const res = await fetch(`/api/admin/rooms/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Gagal menghapus kamar');
      router.push('/admin/rooms');
      router.refresh();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Gagal menghapus kamar');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F9F8ED] font-['Balsamiq_Sans'] text-[#1F4E5F]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-[#0881A3]" />
          <p className="font-bold">Memuat detail...</p>
        </div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F9F8ED] font-['Balsamiq_Sans'] text-[#1F4E5F]">
        <div className="space-y-4 text-center">
          <p className="font-bold text-red-500">
            {error || 'Terjadi kesalahan'}
          </p>
          <Link
            href="/admin/rooms"
            className="font-black text-[#0881A3] underline"
          >
            Kembali ke Daftar
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F8ED] p-4 font-['Balsamiq_Sans'] text-[#1F4E5F] md:p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <header className="flex items-center justify-between">
          <Link
            href="/admin/rooms"
            className="flex items-center gap-2 font-bold text-[#1F4E5F]/60 transition-colors hover:text-[#1F4E5F]"
          >
            <ArrowLeft className="h-5 w-5" />
            Kembali
          </Link>
          <div className="flex gap-2">
            <Link
              href={`/admin/rooms/${room.id}/edit`}
              className="flex items-center gap-2 rounded-xl border border-[#F4E7D3] bg-white px-4 py-2 font-bold text-[#1F4E5F] transition-colors hover:bg-[#F4E7D3]/50"
            >
              <Edit className="h-4 w-4" />
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-2 font-bold text-red-600 transition-colors hover:bg-red-100"
            >
              <Trash2 className="h-4 w-4" />
              Hapus
            </button>
          </div>
        </header>

        <main className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="space-y-6 md:col-span-1">
            <div className="flex flex-col items-center space-y-4 overflow-hidden rounded-3xl bg-[#0881A3] p-8 text-center text-white shadow-xl shadow-[#0881A3]/20">
              {room.imageUrl ? (
                <div className="relative h-32 w-full">
                  <Image
                    src={room.imageUrl}
                    alt={`Kamar ${room.number}`}
                    fill
                    className="rounded-2xl object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20">
                  <Home className="h-10 w-10" />
                </div>
              )}
              <div>
                <h2 className="text-3xl font-black italic">
                  Kamar {room.number}
                </h2>
                <span className="mt-2 inline-block rounded-full bg-white/20 px-4 py-1 text-[10px] font-black tracking-widest text-white uppercase">
                  {room.status}
                </span>
              </div>
            </div>

            <div className="space-y-4 rounded-3xl border border-[#F4E7D3] bg-white p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F9F8ED] text-[#0881A3]">
                  <Info className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black tracking-wider text-[#1F4E5F]/40 uppercase">
                    Kategori
                  </p>
                  <p className="font-bold">{room.category}</p>
                </div>
              </div>
              <div className="border-t border-[#F9F8ED] pt-4">
                <p className="text-[10px] font-black tracking-wider text-[#1F4E5F]/40 uppercase">
                  Harga Bulanan
                </p>
                <p className="text-2xl font-black text-[#0881A3]">
                  Rp {room.priceMonthly.toLocaleString('id-ID')}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6 md:col-span-2">
            <div className="h-full space-y-6 rounded-3xl border border-[#F4E7D3] bg-white p-8">
              <div>
                <h3 className="mb-4 text-lg font-black italic">
                  Fasilitas Kamar
                </h3>
                <div className="min-h-[150px] rounded-2xl bg-[#F9F8ED] p-6">
                  {room.facilities ? (
                    <p className="leading-relaxed font-medium whitespace-pre-wrap">
                      {room.facilities}
                    </p>
                  ) : (
                    <p className="text-[#1F4E5F]/40 italic">
                      Tidak ada fasilitas yang dicatat.
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-4 border-t border-[#F9F8ED] pt-4">
                <div>
                  <p className="text-[10px] font-black tracking-wider text-[#1F4E5F]/40 uppercase">
                    Dibuat Pada
                  </p>
                  <p className="text-sm font-bold">
                    {new Date(room.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-black tracking-wider text-[#1F4E5F]/40 uppercase">
                    Terakhir Diperbarui
                  </p>
                  <p className="text-sm font-bold">
                    {new Date(room.updatedAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
