"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Loader2, Mail, Lock, AlertCircle } from "lucide-react"

const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
    const router = useRouter()
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    })

    async function onSubmit(data: LoginFormValues) {
        setIsLoading(true)
        setError(null)

        try {
            const result = await signIn("credentials", {
                redirect: false,
                email: data.email,
                password: data.password,
            })

            if (result?.error) {
                setError("Invalid email or password")
                setIsLoading(false)
                return
            }

            // We need to get the session to know where to redirect
            // For now, we can use a fetch to /api/auth/session or just check a role if available
            // But signIn result doesn't give session. Let's redirect to / and let middleware handle it if needed
            // Or better, since we know it's client side, we can fetch session
            const response = await fetch("/api/auth/session")
            const session = await response.json()

            if (session?.user?.role === "ADMIN" || session?.user?.role === "OWNER") {
                router.push("/admin")
            } else {
                router.push("/")
            }
        } catch (e) {
            setError("An unexpected error occurred. Please try again.")
            setIsLoading(false)
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-surface p-4 sm:p-6 text-primary-dark">
            <div className="w-full max-w-sm space-y-8 bg-warm-surface p-8 sm:p-10 rounded-3xl border border-primary-dark/20 shadow-sm">
                <div className="text-center">
                    <h1 className="text-[32px] font-bold tracking-tight">Masuk</h1>
                    <p className="text-base font-normal text-primary-dark/60 mt-2">Gunakan akun yang sudah terdaftar untuk melanjutkan.</p>
                </div>

                {error && (
                    <div className="flex items-center gap-3 p-4 bg-red-100/50 border border-red-200 text-red-700 rounded-2xl animate-in fade-in slide-in-from-top-2">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p className="text-sm font-bold">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                                className="w-full pl-11 pr-4 py-4 bg-surface border border-primary-dark/25 rounded-2xl focus:ring-2 focus:ring-accent-color focus:border-accent-color outline-none transition-all font-normal placeholder:text-primary-dark/20"
                            />
                        </div>
                        {errors.email && (
                            <p className="text-[12px] font-bold text-red-500 ml-1">{errors.email.message}</p>
                        )}
                    </div>

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
                                className="w-full pl-11 pr-4 py-4 bg-surface border border-primary-dark/25 rounded-2xl focus:ring-2 focus:ring-accent-color focus:border-accent-color outline-none transition-all font-normal placeholder:text-primary-dark/20"
                            />
                        </div>
                        {errors.password && (
                            <p className="text-[12px] font-bold text-red-500 ml-1">{errors.password.message}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex items-center justify-center py-4 bg-accent-color text-white font-bold rounded-2xl hover:brightness-110 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-md"
                    >
                        {isLoading ? (
                            <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                            "Masuk Sekarang"
                        )}
                    </button>
                </form>

                <div className="text-center space-y-4 pt-2">
                    <p className="text-sm font-bold text-primary-dark/40">
                        Lupa password? <span className="text-primary-dark/60 hover:underline cursor-pointer">Hubungi pengelola.</span>
                    </p>
                    <div className="pt-2 border-t border-primary-dark/10">
                        <p className="text-sm font-normal text-primary-dark/60">
                            Belum punya akun?{" "}
                            <Link href="/signup" className="font-bold text-accent-color hover:underline">
                                Daftar
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
