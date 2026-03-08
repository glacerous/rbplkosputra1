"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, User, Lock, CheckCircle2, AlertCircle } from "lucide-react";

const profileSchema = z.object({
    name: z.string().min(2, "Nama minimal 2 karakter").optional().or(z.literal("")),
    currentPassword: z.string().optional().or(z.literal("")),
    newPassword: z.string().min(8, "Password baru minimal 8 karakter").optional().or(z.literal("")),
    confirmPassword: z.string().optional().or(z.literal("")),
}).refine((data) => {
    if (data.newPassword && !data.currentPassword) return false;
    return true;
}, { message: "Password saat ini diperlukan untuk mengganti password", path: ["currentPassword"] })
.refine((data) => {
    if (data.newPassword && data.newPassword !== data.confirmPassword) return false;
    return true;
}, { message: "Konfirmasi password tidak cocok", path: ["confirmPassword"] });

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
    });

    async function onSubmit(data: ProfileFormValues) {
        setIsLoading(true);
        setError(null);

        const payload: Record<string, string> = {};
        if (data.name) payload.name = data.name;
        if (data.newPassword) {
            payload.password = data.newPassword;
            payload.currentPassword = data.currentPassword!;
        }

        if (Object.keys(payload).length === 0) {
            setError("Tidak ada perubahan untuk disimpan.");
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/public/users/me", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const result = await res.json();
            if (!res.ok) {
                setError(result.message || "Terjadi kesalahan");
                setIsLoading(false);
                return;
            }

            setSuccess(true);
            setTimeout(() => router.push("/"), 1500);
        } catch {
            setError("Koneksi gagal. Silakan coba lagi.");
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-surface px-4 py-8 text-primary-dark sm:px-6 sm:py-12">
            <div className="mx-auto max-w-md">
                <div className="mb-8 flex items-center gap-3">
                    <Link
                        href="/"
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-primary-dark/10 bg-warm-surface transition-all hover:bg-white"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                    <div>
                        <h1 className="text-[24px] font-bold">Profil Saya</h1>
                        <p className="text-sm text-primary-dark/60">Perbarui nama dan password kamu</p>
                    </div>
                </div>

                {success && (
                    <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 animate-in fade-in slide-in-from-top-2">
                        <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-emerald-600" />
                        <p className="text-sm font-bold text-emerald-700">Profil berhasil diperbarui!</p>
                    </div>
                )}

                {error && (
                    <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 animate-in fade-in slide-in-from-top-2">
                        <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-500" />
                        <p className="text-sm font-bold text-red-700">{error}</p>
                    </div>
                )}

                <div className="rounded-3xl border border-primary-dark/10 bg-warm-surface p-8 shadow-sm">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div className="space-y-2">
                            <label className="ml-1 text-sm font-bold text-primary-dark/80">Nama Lengkap</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-primary-dark/30 group-focus-within:text-accent-color transition-colors pointer-events-none">
                                    <User className="h-5 w-5" />
                                </div>
                                <input
                                    {...register("name")}
                                    type="text"
                                    placeholder="Nama baru (opsional)"
                                    className="w-full rounded-2xl border border-primary-dark/25 bg-surface py-3.5 pl-11 pr-4 font-normal outline-none transition-all placeholder:text-primary-dark/20 focus:border-accent-color focus:ring-2 focus:ring-accent-color"
                                />
                            </div>
                            {errors.name && (
                                <p className="ml-1 text-[12px] font-bold text-red-500">{errors.name.message}</p>
                            )}
                        </div>

                        <div className="border-t border-primary-dark/5 pt-5">
                            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-primary-dark/30">Ganti Password (Opsional)</p>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="ml-1 text-sm font-bold text-primary-dark/80">Password Saat Ini</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-primary-dark/30 group-focus-within:text-accent-color transition-colors pointer-events-none">
                                            <Lock className="h-5 w-5" />
                                        </div>
                                        <input
                                            {...register("currentPassword")}
                                            type="password"
                                            placeholder="••••••••"
                                            className="w-full rounded-2xl border border-primary-dark/25 bg-surface py-3.5 pl-11 pr-4 font-normal outline-none transition-all placeholder:text-primary-dark/20 focus:border-accent-color focus:ring-2 focus:ring-accent-color"
                                        />
                                    </div>
                                    {errors.currentPassword && (
                                        <p className="ml-1 text-[12px] font-bold text-red-500">{errors.currentPassword.message}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <label className="ml-1 text-sm font-bold text-primary-dark/80">Password Baru</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-primary-dark/30 group-focus-within:text-accent-color transition-colors pointer-events-none">
                                                <Lock className="h-5 w-5" />
                                            </div>
                                            <input
                                                {...register("newPassword")}
                                                type="password"
                                                placeholder="••••••••"
                                                className="w-full rounded-2xl border border-primary-dark/25 bg-surface py-3.5 pl-11 pr-4 font-normal outline-none transition-all placeholder:text-primary-dark/20 focus:border-accent-color focus:ring-2 focus:ring-accent-color"
                                            />
                                        </div>
                                        {errors.newPassword && (
                                            <p className="ml-1 text-[12px] font-bold text-red-500">{errors.newPassword.message}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="ml-1 text-sm font-bold text-primary-dark/80">Konfirmasi</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-primary-dark/30 group-focus-within:text-accent-color transition-colors pointer-events-none">
                                                <Lock className="h-5 w-5" />
                                            </div>
                                            <input
                                                {...register("confirmPassword")}
                                                type="password"
                                                placeholder="••••••••"
                                                className="w-full rounded-2xl border border-primary-dark/25 bg-surface py-3.5 pl-11 pr-4 font-normal outline-none transition-all placeholder:text-primary-dark/20 focus:border-accent-color focus:ring-2 focus:ring-accent-color"
                                            />
                                        </div>
                                        {errors.confirmPassword && (
                                            <p className="ml-1 text-[12px] font-bold text-red-500">{errors.confirmPassword.message}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="mt-4 flex w-full items-center justify-center rounded-2xl bg-accent-color py-4 font-bold text-white shadow-md transition-all hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : "Simpan Perubahan"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
