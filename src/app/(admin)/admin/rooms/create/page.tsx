"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2 } from "lucide-react";

export default function CreateRoomPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const [formData, setFormData] = useState({
        number: "",
        category: "",
        priceMonthly: 0,
        facilities: "",
        status: "AVAILABLE",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/admin/rooms", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                if (res.status === 400 && data.errors) {
                    setError(data.errors);
                } else {
                    throw new Error(data.message || "Gagal membuat kamar");
                }
                return;
            }

            router.push("/admin/rooms");
            router.refresh();
        } catch (err: any) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <header className="flex items-center justify-between">
                <Link
                    href="/admin/rooms"
                    className="flex items-center gap-2 text-[#1F4E5F]/60 hover:text-[#1F4E5F] font-bold transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Kembali
                </Link>
                <h1 className="text-2xl font-black italic">Tambah Kamar</h1>
            </header>

            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-3xl shadow-sm border border-[#F4E7D3] space-y-6"
            >
                <div className="space-y-2">
                    <label className="text-sm font-black uppercase tracking-wider">Nomor Kamar</label>
                    <input
                        type="text"
                        required
                        className="w-full bg-[#F9F8ED] border border-[#F4E7D3] rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-[#0881A3]/20 transition-all font-medium"
                        placeholder="Contoh: A01"
                        value={formData.number}
                        onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                    />
                    {error?.number && <p className="text-red-500 text-xs font-bold">{error.number[0]}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-black uppercase tracking-wider">Kategori</label>
                    <input
                        type="text"
                        required
                        className="w-full bg-[#F9F8ED] border border-[#F4E7D3] rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-[#0881A3]/20 transition-all font-medium"
                        placeholder="Contoh: Deluxe, Standard"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    />
                    {error?.category && <p className="text-red-500 text-xs font-bold">{error.category[0]}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-black uppercase tracking-wider">Harga per Bulan (Rp)</label>
                    <input
                        type="number"
                        required
                        min="0"
                        className="w-full bg-[#F9F8ED] border border-[#F4E7D3] rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-[#0881A3]/20 transition-all font-medium"
                        value={formData.priceMonthly}
                        onChange={(e) => setFormData({ ...formData, priceMonthly: parseInt(e.target.value) })}
                    />
                    {error?.priceMonthly && (
                        <p className="text-red-500 text-xs font-bold">{error.priceMonthly[0]}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-black uppercase tracking-wider">Fasilitas (Opsional)</label>
                    <textarea
                        className="w-full bg-[#F9F8ED] border border-[#F4E7D3] rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-[#0881A3]/20 transition-all font-medium min-h-[120px]"
                        placeholder="Sebutkan fasilitas kamar..."
                        value={formData.facilities}
                        onChange={(e) => setFormData({ ...formData, facilities: e.target.value })}
                    ></textarea>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-black uppercase tracking-wider">Status</label>
                    <select
                        className="w-full bg-[#F9F8ED] border border-[#F4E7D3] rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-[#0881A3]/20 transition-all font-medium"
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                        <option value="AVAILABLE">AVAILABLE</option>
                        <option value="OCCUPIED">OCCUPIED</option>
                        <option value="MAINTENANCE">MAINTENANCE</option>
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#0881A3] text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-[#066a85] transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-[#0881A3]/20"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Memproses...
                        </>
                    ) : (
                        <>
                            <Save className="w-5 h-5" />
                            Simpan Kamar
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
