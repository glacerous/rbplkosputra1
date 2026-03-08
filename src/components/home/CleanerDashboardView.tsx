import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { ClipboardList } from 'lucide-react';

export default function CleanerDashboardView({ name }: { name: string }) {
  return (
    <div className="min-h-screen bg-[#F9F8ED]">
      <div className="mx-auto max-w-md px-6 pt-8">
        <div className="flex justify-end pb-4">
          <button
            onClick={() => signOut()}
            className="flex items-center gap-2 rounded-lg border border-[#1F4E5F]/10 bg-[#1F4E5F]/5 px-4 py-2 text-[12px] font-bold transition-all hover:bg-white hover:text-red-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Logout
          </button>
        </div>

        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#0881A3]/10">
            <ClipboardList className="h-8 w-8 text-[#0881A3]" />
          </div>
          <h1 className="text-2xl font-black text-[#1F4E5F]">Halo, {name}!</h1>
          <p className="mt-1 text-sm font-medium text-[#1F4E5F]/60">
            Selamat datang kembali!
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/attendance"
            className="flex items-center gap-4 rounded-3xl border border-[#F4E7D3] bg-white p-6 shadow-sm transition-all hover:border-[#0881A3]/30 hover:shadow-md"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0881A3] text-white">
              <ClipboardList className="h-6 w-6" />
            </div>
            <div>
              <p className="font-black text-[#1F4E5F]">Absen Hari Ini</p>
              <p className="text-sm font-medium text-[#1F4E5F]/50">
                Catat kehadiran Anda sekarang
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
