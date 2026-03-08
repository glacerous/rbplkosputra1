"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Clock, CreditCard, LogOut, Upload, CheckCircle2, XCircle, Loader2, ImageIcon } from "lucide-react";

interface PendingPaymentViewProps {
    reservation: any;
}

export default function PendingPaymentView({ reservation }: PendingPaymentViewProps) {
    const room = reservation.room;
    const latestPayment = reservation.payments?.[0];
    const router = useRouter();

    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [proofUrl, setProofUrl] = useState<string | null>(latestPayment?.proofUrl ?? null);
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
            formData.append("proof", file);

            const res = await fetch(`/api/public/payments/${latestPayment.id}/proof`, {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Gagal mengunggah bukti");

            setProofUrl(data.proofUrl);
            router.refresh();
        } catch (err: any) {
            setUploadError(err.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-surface flex items-center justify-center p-6 font-sans text-primary-dark">
            <div className="max-w-xl w-full space-y-8">
                {/* Status Header */}
                <div className="bg-white p-8 rounded-[40px] border border-primary-dark/5 shadow-2xl space-y-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full -mr-16 -mt-16 blur-2xl" />

                    <div className="flex items-center justify-between">
                        <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500">
                            <Clock className="w-8 h-8 animate-pulse" />
                        </div>
                        <button
                            onClick={() => signOut()}
                            className="text-primary-dark/30 hover:text-red-500 transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-3xl font-black italic tracking-tighter">Reservasi Berhasil!</h1>
                        <p className="text-primary-dark/50 font-medium">
                            Kamar {room?.number} telah dititipkan untukmu. Unggah bukti transfer untuk diverifikasi admin.
                        </p>
                    </div>

                    <div className="h-px bg-primary-dark/5" />

                    {/* Payment amount */}
                    <div className="flex items-center gap-4 bg-[#F9F8ED] p-4 rounded-2xl border border-[#F4E7D3]">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#0881A3] shadow-sm">
                            <CreditCard className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <p className="text-[10px] font-black uppercase text-[#0881A3] tracking-widest">Nominal Pembayaran</p>
                            <p className="text-sm font-bold text-[#1F4E5F]">Rp {room?.priceMonthly?.toLocaleString("id-ID")}</p>
                        </div>
                    </div>

                    {/* Proof upload area */}
                    <div className="space-y-3">
                        <p className="text-[10px] font-black uppercase text-primary-dark/40 tracking-widest">Bukti Transfer</p>

                        {proofUrl ? (
                            <div className="space-y-3">
                                <div className="relative rounded-2xl overflow-hidden border border-[#F4E7D3] bg-[#F9F8ED]">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={proofUrl}
                                        alt="Bukti transfer"
                                        className="w-full max-h-64 object-contain"
                                    />
                                </div>
                                <button
                                    onClick={() => fileRef.current?.click()}
                                    disabled={uploading}
                                    className="w-full py-3 rounded-2xl border border-dashed border-[#0881A3]/40 text-[#0881A3] text-sm font-bold hover:bg-[#0881A3]/5 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                                    Ganti Bukti
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => fileRef.current?.click()}
                                disabled={uploading}
                                className="w-full py-10 rounded-2xl border-2 border-dashed border-[#F4E7D3] hover:border-[#0881A3]/40 bg-[#F9F8ED] hover:bg-[#0881A3]/5 transition-all flex flex-col items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {uploading ? (
                                    <Loader2 className="w-8 h-8 text-[#0881A3] animate-spin" />
                                ) : (
                                    <ImageIcon className="w-8 h-8 text-primary-dark/20" />
                                )}
                                <span className="text-sm font-bold text-primary-dark/40">
                                    {uploading ? "Mengunggah..." : "Klik untuk unggah bukti transfer"}
                                </span>
                                <span className="text-[10px] text-primary-dark/30">JPG, PNG, WebP • Maks 5MB</span>
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
                            <p className="text-sm text-red-500 font-medium flex items-center gap-2">
                                <XCircle className="w-4 h-4" />
                                {uploadError}
                            </p>
                        )}
                    </div>
                </div>

                {/* Waiting info */}
                <div className="bg-[#1F4E5F] text-white p-8 rounded-[40px] shadow-xl relative overflow-hidden">
                    <div className="relative z-10 space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">
                            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-ping" />
                            {proofUrl ? "Menunggu Verifikasi" : "Menunggu Bukti"}
                        </div>
                        <h2 className="text-2xl font-black italic leading-tight">
                            {proofUrl
                                ? "Admin sedang memverifikasi\npembayaranmu."
                                : "Unggah bukti transfer\nuntuk lanjut."}
                        </h2>
                        <p className="text-white/40 text-[10px] font-medium max-w-[240px]">
                            {proofUrl
                                ? "Halaman ini akan otomatis diperbarui setelah admin melakukan approval."
                                : "Setelah mengunggah bukti, admin akan segera memverifikasi pembayaranmu."}
                        </p>
                    </div>
                    <div className="absolute right-[-20%] bottom-[-20%] w-64 h-64 bg-[#0881A3] rounded-full blur-[80px] opacity-20" />
                </div>
            </div>
        </div>
    );
}
