import Link from "next/link";

export default function PublicLandingView() {
    return (
        <div className="min-h-screen bg-surface text-primary-dark pb-safe-bottom">
            {/* Container max-w-sm/md to simulate mobile feel on desktop */}
            <div className="max-w-md mx-auto px-6 pt-12">
                <header className="mb-10 text-center">
                    <h1 className="text-[32px] font-bold mb-3 tracking-tight">Kos Putra Friendly</h1>
                    <p className="text-[16px] font-normal text-primary-dark/70 leading-relaxed px-2">
                        Pilihan tepat hunian nyaman dan strategis untuk putra.
                    </p>
                </header>

                <section className="space-y-6">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="rounded-xl bg-warm-surface border border-primary-dark/20 overflow-hidden flex flex-col shadow-sm"
                        >
                            {/* Simple thumbnail placeholder */}
                            <div className="h-40 bg-primary-dark/5 flex items-center justify-center border-b border-primary-dark/5">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary-dark/10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div className="p-4">
                                <h3 className="text-[16px] font-bold mb-1">Kamar Tipe {i === 1 ? 'A' : i === 2 ? 'B' : 'C'} Standard</h3>
                                <p className="caption text-primary-dark/60 mb-3">
                                    Wifi • Kasur • Meja • Kamar Mandi Dalam
                                </p>
                                <div className="text-[16px] font-bold text-accent-color">
                                    Rp 1.500.000 <span className="text-[12px] font-normal text-primary-dark/40">/ bulan</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </section>

                <footer className="mt-12 text-center pb-8">
                    <p className="caption text-primary-dark/30">&copy; 2026 Kos Putra Friendly App • Beranda Pengunjung</p>
                </footer>
            </div>

            {/* Sticky Bottom CTA Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-surface/90 backdrop-blur-md border-t border-primary-dark/10 p-4 z-50">
                <div className="max-w-md mx-auto grid grid-cols-2 gap-4">
                    <Link
                        href="/login"
                        className="w-full text-center py-3 rounded-lg bg-accent-color text-white font-bold transition-all text-[16px] shadow-md active:scale-[0.98]"
                    >
                        Login
                    </Link>
                    <Link
                        href="/signup"
                        className="w-full text-center py-3 rounded-lg border-2 border-primary-dark text-primary-dark font-bold transition-all text-[16px] active:scale-[0.98]"
                    >
                        Daftar
                    </Link>
                </div>
            </div>
        </div>
    );
}
