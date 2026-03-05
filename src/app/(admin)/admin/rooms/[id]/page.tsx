"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { ArrowLeft, Edit, Trash2, Home, Loader2, Info } from "lucide-react";
import { useRouter } from "next/navigation";

interface Room {
    id: string;
    number: string;
    category: string;
    priceMonthly: number;
    facilities: string | null;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export default function RoomDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { id } = use(params);
    const [room, setRoom] = useState<Room | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRoom = async () => {
            try {
                const res = await fetch(`/api/admin/rooms/${id}`);
                if (!res.ok) throw new Error("Kamar tidak ditemukan");
                const data = await res.json();
                setRoom(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRoom();
    }, [id]);

    const handleDelete = async () => {
        if (!confirm("Apakah Anda yakin ingin menghapus kamar ini?")) return;

        try {
            const res = await fetch(`/api/admin/rooms/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Gagal menghapus kamar");
            router.push("/admin/rooms");
            router.refresh();
        } catch (err: any) {
            alert(err.message);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F9F8ED] flex items-center justify-center font-['Balsamiq_Sans'] text-[#1F4E5F]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-[#0881A3]" />
                    <p className="font-bold">Memuat detail...</p>
                </div>
            </div>
        );
    }

    if (error || !room) {
        return (
            <div className="min-h-screen bg-[#F9F8ED] flex items-center justify-center font-['Balsamiq_Sans'] text-[#1F4E5F]">
                <div className="text-center space-y-4">
                    <p className="text-red-500 font-bold">{error || "Terjadi kesalahan"}</p>
                    <Link href="/admin/rooms" className="text-[#0881A3] font-black underline">
                        Kembali ke Daftar
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F9F8ED] p-4 md:p-8 font-['Balsamiq_Sans'] text-[#1F4E5F]">
            <div className="max-w-4xl mx-auto space-y-8">
                <header className="flex items-center justify-between">
                    <Link
                        href="/admin/rooms"
                        className="flex items-center gap-2 text-[#1F4E5F]/60 hover:text-[#1F4E5F] font-bold transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Kembali
                    </Link>
                    <div className="flex gap-2">
                        <Link
                            href={`/admin/rooms/${room.id}/edit`}
                            className="flex items-center gap-2 bg-white border border-[#F4E7D3] text-[#1F4E5F] px-4 py-2 rounded-xl font-bold hover:bg-[#F4E7D3]/50 transition-colors"
                        >
                            <Edit className="w-4 h-4" />
                            Edit
                        </Link>
                        <button
                            onClick={handleDelete}
                            className="flex items-center gap-2 bg-red-50 text-red-600 border border-red-100 px-4 py-2 rounded-xl font-bold hover:bg-red-100 transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                            Hapus
                        </button>
                    </div>
                </header>

                <main className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-1 space-y-6">
                        <div className="bg-[#0881A3] text-white p-8 rounded-3xl shadow-xl shadow-[#0881A3]/20 flex flex-col items-center text-center space-y-4">
                            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                                <Home className="w-10 h-10" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black italic">Kamar {room.number}</h2>
                                <span className="inline-block px-4 py-1 bg-white/20 text-white text-[10px] font-black rounded-full uppercase tracking-widest mt-2">
                                    {room.status}
                                </span>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-3xl border border-[#F4E7D3] space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-[#F9F8ED] rounded-xl flex items-center justify-center text-[#0881A3]">
                                    <Info className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-wider text-[#1F4E5F]/40">Kategori</p>
                                    <p className="font-bold">{room.category}</p>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-[#F9F8ED]">
                                <p className="text-[10px] font-black uppercase tracking-wider text-[#1F4E5F]/40">Harga Bulanan</p>
                                <p className="text-2xl font-black text-[#0881A3]">
                                    Rp {room.priceMonthly.toLocaleString("id-ID")}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-white p-8 rounded-3xl border border-[#F4E7D3] space-y-6 h-full">
                            <div>
                                <h3 className="text-lg font-black italic mb-4">Fasilitas Kamar</h3>
                                <div className="bg-[#F9F8ED] p-6 rounded-2xl min-h-[150px]">
                                    {room.facilities ? (
                                        <p className="whitespace-pre-wrap font-medium leading-relaxed">
                                            {room.facilities}
                                        </p>
                                    ) : (
                                        <p className="text-[#1F4E5F]/40 italic">Tidak ada fasilitas yang dicatat.</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-4 pt-4 border-t border-[#F9F8ED]">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-wider text-[#1F4E5F]/40">
                                        Dibuat Pada
                                    </p>
                                    <p className="text-sm font-bold">
                                        {new Date(room.createdAt).toLocaleDateString("id-ID", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                        })}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-wider text-[#1F4E5F]/40">
                                        Terakhir Diperbarui
                                    </p>
                                    <p className="text-sm font-bold">
                                        {new Date(room.updatedAt).toLocaleDateString("id-ID", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
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
