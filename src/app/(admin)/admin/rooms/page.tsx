"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, Eye, Search, Home } from "lucide-react";

interface Room {
    id: string;
    number: string;
    category: string;
    priceMonthly: number;
    status: string;
}

export default function AdminRoomsPage() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchRooms = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/admin/rooms");
            if (!res.ok) throw new Error("Gagal mengambil data kamar");
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
        if (!confirm("Apakah Anda yakin ingin menghapus kamar ini?")) return;

        try {
            const res = await fetch(`/api/admin/rooms/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Gagal menghapus kamar");
            setRooms(rooms.filter((room) => room.id !== id));
        } catch (err: any) {
            alert(err.message);
        }
    };

    const filteredRooms = rooms.filter((room) =>
        room.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-[#F4E7D3]">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#0881A3] rounded-2xl flex items-center justify-center text-white">
                        <Home className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black italic">Kelola Kamar</h1>
                        <p className="text-[#1F4E5F]/70 font-medium">Sprint 2 - REST API Pattern</p>
                    </div>
                </div>
                <Link
                    href="/admin/rooms/create"
                    className="flex items-center justify-center gap-2 bg-[#0881A3] text-white px-6 py-3 rounded-2xl font-bold hover:bg-[#066a85] transition-colors shadow-lg shadow-[#0881A3]/20"
                >
                    <Plus className="w-5 h-5" />
                    Tambah Kamar
                </Link>
            </header>

            <main className="space-y-6">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1F4E5F]/40 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Cari nomor kamar atau kategori..."
                        className="w-full bg-white border border-[#F4E7D3] rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-[#0881A3]/20 transition-all font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="bg-[#F4E7D3]/30 rounded-3xl overflow-hidden border border-[#F4E7D3]">
                    {loading ? (
                        <div className="p-12 text-center font-bold animate-pulse">Memuat data...</div>
                    ) : error ? (
                        <div className="p-12 text-center text-red-500 font-bold">{error}</div>
                    ) : filteredRooms.length === 0 ? (
                        <div className="p-12 text-center font-bold">Tidak ada kamar ditemukan.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-[#F4E7D3] text-[#1F4E5F] font-black uppercase text-xs tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4">Nomor</th>
                                        <th className="px-6 py-4">Kategori</th>
                                        <th className="px-6 py-4">Harga/Bulan</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#F4E7D3]">
                                    {filteredRooms.map((room) => (
                                        <tr key={room.id} className="bg-white hover:bg-[#F9F8ED] transition-colors">
                                            <td className="px-6 py-4 font-bold">{room.number}</td>
                                            <td className="px-6 py-4 font-medium">{room.category}</td>
                                            <td className="px-6 py-4 font-medium">
                                                Rp {room.priceMonthly.toLocaleString("id-ID")}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${room.status === "AVAILABLE"
                                                        ? "bg-green-100 text-green-700"
                                                        : room.status === "OCCUPIED"
                                                            ? "bg-orange-100 text-orange-700"
                                                            : "bg-red-100 text-red-700"
                                                        }`}
                                                >
                                                    {room.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Link
                                                        href={`/admin/rooms/${room.id}`}
                                                        className="p-2 text-[#0881A3] hover:bg-[#0881A3]/10 rounded-xl transition-colors"
                                                        title="Detail"
                                                    >
                                                        <Eye className="w-5 h-5" />
                                                    </Link>
                                                    <Link
                                                        href={`/admin/rooms/${room.id}/edit`}
                                                        className="p-2 text-[#0881A3] hover:bg-[#0881A3]/10 rounded-xl transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit className="w-5 h-5" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(room.id)}
                                                        className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                                                        title="Hapus"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
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
