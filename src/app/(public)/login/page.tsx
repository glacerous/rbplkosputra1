"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
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
        <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-50 p-6">
            <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-neutral-100">
                <div className="text-center">
                    <h1 className="text-4xl font-black text-neutral-900 tracking-tight">Welcome Back</h1>
                    <p className="text-neutral-500 font-medium mt-2">Sign in to manage your property</p>
                </div>

                {error && (
                    <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl animate-in fade-in slide-in-from-top-2">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p className="text-sm font-semibold">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-neutral-700 ml-1">Email Address</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-400 group-focus-within:text-neutral-900 transition-colors">
                                <Mail className="w-5 h-5" />
                            </div>
                            <input
                                {...register("email")}
                                type="email"
                                placeholder="name@example.com"
                                className="w-full pl-11 pr-4 py-4 bg-neutral-50 border-2 border-neutral-100 rounded-2xl focus:border-neutral-900 focus:bg-white outline-none transition-all font-medium placeholder:text-neutral-300"
                            />
                        </div>
                        {errors.email && (
                            <p className="text-xs font-bold text-red-500 ml-1">{errors.email.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-neutral-700 ml-1">Password</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-400 group-focus-within:text-neutral-900 transition-colors">
                                <Lock className="w-5 h-5" />
                            </div>
                            <input
                                {...register("password")}
                                type="password"
                                placeholder="••••••••"
                                className="w-full pl-11 pr-4 py-4 bg-neutral-50 border-2 border-neutral-100 rounded-2xl focus:border-neutral-900 focus:bg-white outline-none transition-all font-medium placeholder:text-neutral-300"
                            />
                        </div>
                        {errors.password && (
                            <p className="text-xs font-bold text-red-500 ml-1">{errors.password.message}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex items-center justify-center py-4 bg-neutral-900 text-white font-black rounded-2xl hover:bg-neutral-800 focus:ring-4 focus:ring-neutral-200 transition-all shadow-xl hover:shadow-2xl active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                            "Sign In"
                        )}
                    </button>
                </form>

                <div className="text-center pt-2">
                    <p className="text-sm font-bold text-neutral-400">
                        Forgot password? <span className="text-neutral-900 hover:underline cursor-pointer">Reset it</span>
                    </p>
                </div>
            </div>
        </div>
    )
}
