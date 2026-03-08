import Link from 'next/link';

export default function PublicLandingView() {
  return (
    <div className="bg-surface text-primary-dark pb-safe-bottom min-h-screen">
      {/* Container max-w-sm/md to simulate mobile feel on desktop */}
      <div className="mx-auto max-w-md px-6 pt-8 sm:pt-12">
        <header className="mb-10 text-center">
          <h1 className="mb-3 text-[32px] font-bold tracking-tight">
            Kos Putra Friendly
          </h1>
          <p className="text-primary-dark/70 px-2 text-[16px] leading-relaxed font-normal">
            Pilihan tepat hunian nyaman dan strategis untuk putra.
          </p>
        </header>

        <section className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-warm-surface border-primary-dark/20 flex flex-col overflow-hidden rounded-xl border shadow-sm"
            >
              {/* Simple thumbnail placeholder */}
              <div className="bg-primary-dark/5 border-primary-dark/5 flex h-40 items-center justify-center border-b transition-opacity duration-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-primary-dark/10 h-10 w-10"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="p-4">
                <h3 className="mb-1 text-[16px] font-bold">
                  Kamar Tipe {i === 1 ? 'A' : i === 2 ? 'B' : 'C'} Standard
                </h3>
                <p className="caption text-primary-dark/60 mb-3">
                  Wifi • Kasur • Meja • Kamar Mandi Dalam
                </p>
                <div className="text-accent-color text-[16px] font-bold">
                  Rp 1.500.000{' '}
                  <span className="text-primary-dark/40 text-[12px] font-normal">
                    / bulan
                  </span>
                </div>
              </div>
            </div>
          ))}
        </section>

        <footer className="mt-12 pb-8 text-center">
          <p className="caption text-primary-dark/30">
            &copy; 2026 Kos Putra Friendly App • Beranda Pengunjung
          </p>
        </footer>
      </div>

      {/* Sticky Bottom CTA Bar */}
      <div className="bg-surface/90 border-primary-dark/10 fixed right-0 bottom-0 left-0 z-50 border-t p-4 backdrop-blur-md">
        <div className="mx-auto grid max-w-md grid-cols-2 gap-4">
          <Link
            href="/login"
            className="bg-accent-color w-full rounded-lg py-3 text-center text-[16px] font-bold text-white shadow-md transition-all active:scale-[0.98]"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="border-primary-dark text-primary-dark w-full rounded-lg border-2 py-3 text-center text-[16px] font-bold transition-all active:scale-[0.98]"
          >
            Daftar
          </Link>
        </div>
      </div>
    </div>
  );
}
