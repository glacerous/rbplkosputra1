"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Room {
    id: string;
    number: string;
    category: string;
    priceMonthly: number;
    facilities: string | null;
    status: string;
}

export default function RoomsPage() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/public/rooms")
            .then((res) => res.json())
            .then((data) => {
                setRooms(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-surface flex items-center justify-center font-sans text-primary-dark">
                <div className="font-bold animate-pulse">Memuat Daftar Kamar...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-surface text-primary-dark font-sans py-16 px-6">
            <div className="max-w-6xl mx-auto">
                <header className="mb-12 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Pilih Kamarmu</h1>
                    <p className="text-lg text-primary-dark/60 max-w-2xl mx-auto">
                        Temukan hunian yang nyaman dan sesuai dengan kebutuhanmu. Gunakan fasilitas terbaik kami.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {rooms.map((room) => (
                        <div
                            key={room.id}
                            className="group relative bg-warm-surface rounded-2xl border border-primary-dark/10 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                        >
                            <div className="aspect-[16/10] bg-primary-dark/5 flex items-center justify-center relative overflow-hidden">
                                <span className="text-primary-dark/10 text-6xl font-black italic select-none">
                                    {room.number}
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-t from-warm-surface to-transparent opacity-60" />
                                <div className="absolute top-4 right-4">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${room.status === 'AVAILABLE' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                        {room.status === 'AVAILABLE' ? 'Tersedia' : 'Terisi'}
                                    </span>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h2 className="text-xl font-bold mb-1">Kamar {room.number}</h2>
                                        <p className="text-sm text-primary-dark/50 font-medium">{room.category}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[10px] font-bold uppercase text-primary-dark/30 tracking-widest leading-none mb-1">Per Bulan</div>
                                        <div className="text-xl font-bold text-accent-color">
                                            Rp {room.priceMonthly.toLocaleString('id-ID')}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex flex-wrap gap-2">
                                        {room.facilities?.split(',').map((f, i) => (
                                            <span key={i} className="px-2 py-1 bg-surface border border-primary-dark/5 rounded text-[10px] font-medium text-primary-dark/60">
                                                {f.trim()}
                                            </span>
                                        )) || <span className="text-xs italic text-primary-dark/20">Fasilitas standar</span>}
                                    </div>

                                    <Link
                                        href={room.status === 'AVAILABLE' ? `/login?redirect=/rooms/${room.id}` : '#'}
                                        onClick={(e) => room.status !== 'AVAILABLE' && e.preventDefault()}
                                        className={`w-full block text-center py-3 rounded-xl font-bold text-sm transition-all border-2 ${room.status === 'AVAILABLE'
                                                ? 'bg-accent-color text-white border-accent-color hover:bg-white hover:text-accent-color'
                                                : 'bg-primary-dark/10 text-primary-dark/30 border-transparent cursor-not-allowed'
                                            }`}
                                    >
                                        {room.status === 'AVAILABLE' ? 'Booking Sekarang' : 'Sudah Dipesan'}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {rooms.length === 0 && (
                    <div className="text-center py-20 bg-warm-surface rounded-2xl border border-dashed border-primary-dark/20">
                        <p className="text-primary-dark/40 font-bold italic">Maaf, saat ini belum ada kamar yang terdaftar.</p>
                    </div>
                )}

                <div className="mt-16 flex justify-center">
                    <Link href="/" className="text-sm font-bold text-primary-dark/40 hover:text-accent-color transition-colors flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Kembali ke Beranda
                    </Link>
                </div>
            </div>
        </div>
    );
}
