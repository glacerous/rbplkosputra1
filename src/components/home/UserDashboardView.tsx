interface UserDashboardViewProps {
    reservation: any;
}

export default function UserDashboardView({ reservation }: UserDashboardViewProps) {
    const latestPayment = reservation.payments?.[0];
    const room = reservation.room;

    return (
        <div className="w-full min-h-screen bg-surface text-primary-dark font-sans py-12 px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
                    <div>
                        <h1 className="text-[32px] font-bold mb-2">Hunian Saya</h1>
                        <p className="text-base font-normal text-primary-dark/60">Kelola kamar dan detail masa tinggalmu.</p>
                    </div>
                    <div className="bg-warm-surface border border-primary-dark/10 rounded-xl p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-accent-color/10 flex items-center justify-center">
                            <div className="w-2.5 h-2.5 rounded-full bg-accent-color animate-pulse" />
                        </div>
                        <div>
                            <div className="text-[12px] font-bold text-primary-dark/40 uppercase tracking-wide">Status Sewa</div>
                            <div className="text-sm font-bold">Terdaftar & Aktif</div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Room Info */}
                    <div className="p-6 rounded-xl bg-warm-surface border border-primary-dark/10 col-span-1 md:col-span-2 shadow-sm">
                        <h3 className="text-base font-bold mb-6 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent-color" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10.496 2.132a1 1 0 00-.992 0l-7 4A1 1 0 003 8v7a1 1 0 001 1h12a1 1 0 001-1V8a1 1 0 00-.504-.868l-7-4zM5 14V8.4l5-2.857 5 2.857V14H5z" clipRule="evenodd" />
                            </svg>
                            Informasi Kamar
                        </h3>
                        <div className="flex flex-col sm:flex-row gap-6">
                            <div className="w-full sm:w-1/2 aspect-video bg-primary-dark/5 rounded-lg border border-primary-dark/5 flex items-center justify-center italic text-primary-dark/20 text-sm">
                                Foto Kamar
                            </div>
                            <div className="flex-1 flex flex-col justify-between">
                                <div className="space-y-4">
                                    <div>
                                        <div className="text-primary-dark/40 text-[12px] font-bold uppercase">Nomor Kamar</div>
                                        <div className="text-xl font-bold">Kamar {room?.number || 'N/A'}</div>
                                    </div>
                                    <div>
                                        <div className="text-primary-dark/40 text-[12px] font-bold uppercase">Tipe/Kategori</div>
                                        <div className="text-sm font-bold">{room?.category || 'Standard'}</div>
                                    </div>
                                </div>
                                <div className="pt-6 flex gap-3">
                                    <button className="flex-1 py-2.5 rounded-lg bg-surface border border-primary-dark/10 text-sm font-bold hover:bg-white transition-all">
                                        Detail Kamar
                                    </button>
                                    <button className="flex-1 py-2.5 rounded-lg bg-surface border border-primary-dark/10 text-sm font-bold hover:bg-white transition-all">
                                        Lapor Kendala
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Active Lease & Payment */}
                    <div className="space-y-6">
                        <div className="p-6 rounded-xl bg-warm-surface border border-primary-dark/10 shadow-sm">
                            <h3 className="text-base font-bold mb-4 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent-color" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 01-1.447.894l-4.553-2.276-4.553 2.276A1 1 0 014 16V4z" clipRule="evenodd" />
                                </svg>
                                Masa Sewa
                            </h3>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-primary-dark/50">Mulai sejak</span>
                                    <span className="font-bold">{reservation.checkInAt ? new Date(reservation.checkInAt).toLocaleDateString('id-ID') : 'N/A'}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-primary-dark/50">Biaya Bulanan</span>
                                    <span className="font-bold text-accent-color">Rp {room?.priceMonthly?.toLocaleString('id-ID') || '0'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 rounded-xl bg-warm-surface border border-primary-dark/10 shadow-sm">
                            <h3 className="text-base font-bold mb-4 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent-color" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                                    <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                                </svg>
                                Status Pembayaran
                            </h3>
                            <div className="p-4 rounded-lg bg-surface border border-primary-dark/5 mb-4">
                                <div className="flex items-center justify-between mb-1">
                                    <div className="text-[10px] font-bold uppercase text-primary-dark/30 tracking-wider">Terakhir</div>
                                    <div className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${latestPayment?.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                        {latestPayment?.status || 'No Records'}
                                    </div>
                                </div>
                                <div className="text-lg font-bold">
                                    {latestPayment ? `Rp ${latestPayment.amount.toLocaleString('id-ID')}` : '-'}
                                </div>
                            </div>
                            <button className="w-full py-3 rounded-lg bg-accent-color text-white font-bold transition-all text-sm border-2 border-accent-color hover:bg-white hover:text-accent-color">
                                Riwayat Pembayaran
                            </button>
                        </div>
                    </div>
                </div>

                <footer className="mt-12 text-center text-[12px] font-normal text-primary-dark/30">
                    &copy; 2026 Kos Putra Friendly• Layanan Tenant Terpadu
                </footer>
            </div>
        </div>
    );
}
