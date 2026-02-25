import { auth } from "@/server/auth/auth"
import { redirect } from "next/navigation"
import { User, Mail, Shield, LayoutDashboard } from "lucide-react"
import { LogoutButton } from "@/components/auth/logout-button"

export default async function AdminDashboardPage() {
    const session = await auth()

    if (!session) {
        redirect("/login")
    }

    return (
        <div className="min-h-screen bg-neutral-50 p-4 md:p-8">
            <div className="max-w-5xl mx-auto space-y-8">
                <header className="flex items-center justify-between bg-white p-6 rounded-3xl shadow-sm border border-neutral-100">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-neutral-900 rounded-2xl flex items-center justify-center text-white">
                            <LayoutDashboard className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-neutral-900">Admin Dashboard</h1>
                            <p className="text-neutral-500 font-medium">Manage your residence platform</p>
                        </div>
                    </div>

                    <LogoutButton />
                </header>

                <main className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* User Profile Card */}
                    <div className="md:col-span-1 bg-white p-8 rounded-3xl shadow-sm border border-neutral-100 space-y-6">
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-400 border-4 border-white shadow-lg">
                                <User className="w-12 h-12" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-neutral-900">{session.user.name}</h2>
                                <span className="inline-block px-3 py-1 bg-neutral-900 text-white text-[10px] font-black rounded-full uppercase tracking-widest mt-1">
                                    {session.user.role}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-neutral-50">
                            <div className="flex items-center gap-3 text-neutral-600">
                                <Mail className="w-5 h-5" />
                                <span className="text-sm font-medium truncate">{session.user.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-neutral-600">
                                <Shield className="w-5 h-5" />
                                <span className="text-sm font-medium">Session Active</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats / Placeholder */}
                    <div className="md:col-span-2 bg-neutral-900 text-white p-8 rounded-3xl shadow-xl space-y-4 flex flex-col justify-center overflow-hidden relative">
                        <div className="relative z-10">
                            <h2 className="text-3xl font-black italic">PHASE 1 MVP</h2>
                            <p className="text-neutral-400 font-medium max-w-sm">
                                Role-Based Access Control and Hybrid Backend Architecture implementation complete.
                            </p>
                        </div>
                        {/* Abstract background element */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                    </div>
                </main>
            </div>
        </div>
    )
}
