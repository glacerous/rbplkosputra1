import Link from "next/link";

export default function LoggedInNoRoomView() {
    return (
        <div className="min-h-screen bg-surface text-primary-dark pb-safe-bottom">
            <div className="max-w-md mx-auto px-6 pt-12 text-center">
                <div className="p-4 rounded-full bg-accent-color/10 border border-accent-color/20 inline-block mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent-color" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                </div>

                <header className="mb-10">
                    <h1 className="text-[32px] font-bold mb-3 tracking-tight leading-tight px-4">Halo, Mari Temukan Kamarmu</h1>
                    <p className="text-[16px] font-normal text-primary-dark/70 leading-relaxed">
                        Cari kamar yang tersedia dan segera booking sebelum penuh.
                    </p>
                </header>

                <section className="space-y-4 text-left mb-10">
                    <h2 className="text-[16px] font-bold mb-4 opacity-40 uppercase tracking-widest text-center">Rekomendasi Kamar</h2>
                    {[1, 2].map(i => (
                        <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-warm-surface border border-primary-dark/10 shadow-sm">
                            <div className="w-16 h-16 rounded-lg bg-primary-dark/5 flex items-center justify-center border border-primary-dark/5">
                                <span className="caption font-bold text-primary-dark/20 text-center leading-none">A-{100 + i}</span>
                            </div>
                            <div className="flex-1">
                                <div className="text-[16px] font-bold text-primary-dark">Kamar A-{100 + i} Standard</div>
                                <div className="caption text-primary-dark/50">Siap huni • Lantai {i}</div>
                            </div>
                            <div className="text-[16px] font-bold text-accent-color">Rp 1.5M</div>
                        </div>
                    ))}
                </section>

                <p className="caption text-primary-dark/30 mt-8 mb-4 px-8">
                    Klik tombol di bawah untuk melihat semua daftar kamar yang tersedia.
                </p>
            </div>

            {/* Sticky Bottom Booking Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-surface/90 backdrop-blur-md border-t border-primary-dark/10 p-4 z-50">
                <div className="max-w-md mx-auto">
                    <Link
                        href="/rooms"
                        className="w-full block text-center py-4 rounded-xl bg-accent-color text-white font-bold transition-all text-[16px] shadow-lg active:scale-[0.98]"
                    >
                        Booking Kamar Sekarang
                    </Link>
                </div>
            </div>
        </div>
    );
}

