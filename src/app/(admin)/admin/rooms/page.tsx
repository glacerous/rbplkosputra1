'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Eye, Search, Home } from 'lucide-react';

interface Room {
  id: string;
  number: string;
  category: string;
  priceMonthly: number;
  status: string;
  imageUrl?: string | null;
}

export default function AdminRoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/rooms');
      if (!res.ok) throw new Error('Gagal mengambil data kamar');
      const data = await res.json();
      setRooms(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus kamar ini?')) return;

    try {
      const res = await fetch(`/api/admin/rooms/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Gagal menghapus kamar');
      setRooms(rooms.filter((room) => room.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filteredRooms = rooms.filter(
    (room) =>
      room.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.category.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-8">
      <header className="flex flex-col justify-between gap-4 rounded-3xl border border-[#F4E7D3] bg-white p-6 shadow-sm md:flex-row md:items-center">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0881A3] text-white">
            <Home className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black italic">Kelola Kamar</h1>
            <p className="font-medium text-[#1F4E5F]/70">
              Sprint 2 - REST API Pattern
            </p>
          </div>
        </div>
        <Link
          href="/admin/rooms/create"
          className="flex items-center justify-center gap-2 rounded-2xl bg-[#0881A3] px-6 py-3 font-bold text-white shadow-lg shadow-[#0881A3]/20 transition-colors hover:bg-[#066a85]"
        >
          <Plus className="h-5 w-5" />
          Tambah Kamar
        </Link>
      </header>

      <main className="space-y-6">
        <div className="relative">
          <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-[#1F4E5F]/40" />
          <input
            type="text"
            placeholder="Cari nomor kamar atau kategori..."
            className="w-full rounded-2xl border border-[#F4E7D3] bg-white py-4 pr-4 pl-12 font-medium transition-all outline-none focus:ring-2 focus:ring-[#0881A3]/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="overflow-hidden rounded-3xl border border-[#F4E7D3] bg-[#F4E7D3]/30">
          {loading ? (
            <div className="animate-pulse p-12 text-center font-bold">
              Memuat data...
            </div>
          ) : error ? (
            <div className="p-12 text-center font-bold text-red-500">
              {error}
            </div>
          ) : filteredRooms.length === 0 ? (
            <div className="p-12 text-center font-bold">
              Tidak ada kamar ditemukan.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead className="bg-[#F4E7D3] text-xs font-black tracking-wider text-[#1F4E5F] uppercase">
                  <tr>
                    <th className="w-14 px-4 py-4"></th>
                    <th className="px-6 py-4">Nomor</th>
                    <th className="px-6 py-4">Kategori</th>
                    <th className="px-6 py-4">Harga/Bulan</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F4E7D3]">
                  {filteredRooms.map((room) => (
                    <tr
                      key={room.id}
                      className="bg-white transition-colors hover:bg-[#F9F8ED]"
                    >
                      <td className="px-4 py-3">
                        {room.imageUrl ? (
                          <img
                            src={room.imageUrl}
                            alt={`Kamar ${room.number}`}
                            className="h-10 w-10 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F9F8ED] text-[#1F4E5F]/20">
                            <Home className="h-5 w-5" />
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 font-bold">{room.number}</td>
                      <td className="px-6 py-4 font-medium">{room.category}</td>
                      <td className="px-6 py-4 font-medium">
                        Rp {room.priceMonthly.toLocaleString('id-ID')}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-[10px] font-black tracking-widest uppercase ${
                            room.status === 'AVAILABLE'
                              ? 'bg-green-100 text-green-700'
                              : room.status === 'OCCUPIED'
                                ? 'bg-orange-100 text-orange-700'
                                : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {room.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/admin/rooms/${room.id}`}
                            className="rounded-xl p-2 text-[#0881A3] transition-colors hover:bg-[#0881A3]/10"
                            title="Detail"
                          >
                            <Eye className="h-5 w-5" />
                          </Link>
                          <Link
                            href={`/admin/rooms/${room.id}/edit`}
                            className="rounded-xl p-2 text-[#0881A3] transition-colors hover:bg-[#0881A3]/10"
                            title="Edit"
                          >
                            <Edit className="h-5 w-5" />
                          </Link>
                          <button
                            onClick={() => handleDelete(room.id)}
                            className="rounded-xl p-2 text-red-500 transition-colors hover:bg-red-50"
                            title="Hapus"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
