"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { Loader2, Mail, Lock, User, CheckCircle2, AlertCircle } from "lucide-react"

const signupSchema = z.object({
    name: z.string().min(2, "Nama minimal 2 karakter"),
    email: z.string().email("Email tidak valid"),
    password: z.string().min(8, "Password minimal 8 karakter"),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi password tidak cocok",
    path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>

export default function SignupPage() {
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignupFormValues>({
        resolver: zodResolver(signupSchema),
    })

    async function onSubmit(data: SignupFormValues) {
        setIsLoading(true)
        setError(null)

        try {
            const res = await fetch("/api/public/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: data.name,
                    email: data.email,
                    password: data.password,
                }),
            });

            const result = await res.json();

            if (!res.ok) {
                setError(result.error || "Terjadi kesalahan saat registrasi");
                setIsLoading(false)
                return
            }

            setSuccess(true);

            // Auto login after success
            setTimeout(async () => {
                await signIn("credentials", {
                    redirect: true,
                    callbackUrl: "/",
                    email: data.email,
                    password: data.password,
                });
            }, 2000);

        } catch (e) {
            setError("Koneksi gagal. Silakan coba lagi.");
            setIsLoading(false)
        }
    }

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-surface p-4 text-primary-dark">
                <div className="w-full max-w-sm text-center space-y-6 bg-warm-surface p-10 rounded-3xl border border-emerald-100 shadow-xl animate-in zoom-in-95 duration-500">
                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h1 className="text-[32px] font-bold tracking-tight">Berhasil!</h1>
                    <p className="text-base text-primary-dark/60">Akun kamu telah dibuat. Kamu akan dialihkan ke dashboard dalam sekejap...</p>
                    <div className="pt-4">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto text-emerald-500" />
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-surface p-4 sm:p-6 text-primary-dark">
            <div className="w-full max-w-md space-y-8 bg-warm-surface p-8 sm:p-10 rounded-3xl border border-primary-dark/20 shadow-sm">
                <div className="text-center">
                    <h1 className="text-[32px] font-bold tracking-tight">Daftar Akun</h1>
                    <p className="text-base font-normal text-primary-dark/60 mt-2">Buat akun baru untuk mulai mencari dan melakukan booking kamar.</p>
                </div>

                {error && (
                    <div className="flex items-center gap-3 p-4 bg-red-100/50 border border-red-200 text-red-700 rounded-2xl animate-in fade-in slide-in-from-top-2">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p className="text-sm font-bold">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-primary-dark/80 ml-1">Nama Lengkap</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-primary-dark/30 group-focus-within:text-accent-color transition-colors">
                                <User className="w-5 h-5" />
                            </div>
                            <input
                                {...register("name")}
                                type="text"
                                placeholder="Pria Solo"
                                className="w-full pl-11 pr-4 py-3.5 bg-surface border border-primary-dark/25 rounded-2xl focus:ring-2 focus:ring-accent-color focus:border-accent-color outline-none transition-all font-normal placeholder:text-primary-dark/20"
                            />
                        </div>
                        {errors.name && (
                            <p className="text-[12px] font-bold text-red-500 ml-1">{errors.name.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-primary-dark/80 ml-1">Email</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-primary-dark/30 group-focus-within:text-accent-color transition-colors">
                                <Mail className="w-5 h-5" />
                            </div>
                            <input
                                {...register("email")}
                                type="email"
                                placeholder="nama@email.com"
                                className="w-full pl-11 pr-4 py-3.5 bg-surface border border-primary-dark/25 rounded-2xl focus:ring-2 focus:ring-accent-color focus:border-accent-color outline-none transition-all font-normal placeholder:text-primary-dark/20"
                            />
                        </div>
                        {errors.email && (
                            <p className="text-[12px] font-bold text-red-500 ml-1">{errors.email.message}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-primary-dark/80 ml-1">Password</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-primary-dark/30 group-focus-within:text-accent-color transition-colors">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <input
                                    {...register("password")}
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full pl-11 pr-4 py-3.5 bg-surface border border-primary-dark/25 rounded-2xl focus:ring-2 focus:ring-accent-color focus:border-accent-color outline-none transition-all font-normal placeholder:text-primary-dark/20"
                                />
                            </div>
                            {errors.password && (
                                <p className="text-[12px] font-bold text-red-500 ml-1">{errors.password.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-primary-dark/80 ml-1">Konfirmasi</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-primary-dark/30 group-focus-within:text-accent-color transition-colors">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <input
                                    {...register("confirmPassword")}
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full pl-11 pr-4 py-3.5 bg-surface border border-primary-dark/25 rounded-2xl focus:ring-2 focus:ring-accent-color focus:border-accent-color outline-none transition-all font-normal placeholder:text-primary-dark/20"
                                />
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-[12px] font-bold text-red-500 ml-1">{errors.confirmPassword.message}</p>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full mt-4 flex items-center justify-center py-4 bg-accent-color text-white font-bold rounded-2xl hover:brightness-110 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-md"
                    >
                        {isLoading ? (
                            <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                            "Daftar Sekarang"
                        )}
                    </button>
                </form>

                <div className="text-center pt-2">
                    <p className="text-sm font-normal text-primary-dark/60">
                        Sudah punya akun?{" "}
                        <Link href="/login" className="font-bold text-accent-color hover:underline transition-all">
                            Masuk
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
