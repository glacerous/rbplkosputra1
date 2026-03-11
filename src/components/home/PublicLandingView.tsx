import {
  MapPin,
  Maximize2,
  ZapOff,
  Bath,
  Wind,
  Navigation,
  Utensils,
  ShoppingBag,
  Church,
  CreditCard,
  School,
  Hospital,
  ChevronRight
} from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PublicLandingView() {
  const [activeTab, setActiveTab] = useState<'nearby' | 'transport'>('nearby');
  const [rooms, setRooms] = useState<any[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(true);

  useEffect(() => {
    fetch('/api/public/rooms?status=AVAILABLE')
      .then((res) => res.json())
      .then((data) => {
        setRooms(data);
        setLoadingRooms(false);
      })
      .catch(() => setLoadingRooms(false));
  }, []);

  const nearbyPlaces = [
    { name: 'Universitas Atma Jaya Yogyakarta', distance: '718 m', icon: School },
    { name: 'Circle K Seturan', distance: '396 m', icon: ShoppingBag },
    { name: 'Rumah Makan & Catering Dua Putri', distance: '771 m', icon: Utensils },
    { name: 'RS Khusus Ibu Anak Sadewa', distance: '571 m', icon: Hospital },
    { name: 'Gereja Kristen Jawa Ambarrukmo', distance: '2.1 km', icon: Church },
    { name: 'BNI Syariah Jalan Kaliurang', distance: '3.8 km', icon: CreditCard },
  ];

  return (
    <div className="bg-surface text-primary-dark pb-32 min-h-screen font-sans">
      <div className="mx-auto max-w-md">
        {/* Header Hero */}
        <header className="bg-white rounded-b-[40px] shadow-sm border-b border-[#F4E7D3] overflow-hidden">
          <div className="h-64 w-full relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/kos-hero.png"
              alt="Kos Putra Friendly"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent" />
          </div>
          <div className="px-6 pb-10 text-center -mt-12 relative z-10">
            <div className="mx-auto w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-[#0881A3] mb-4 shadow-xl border border-[#F4E7D3]">
              <Navigation className="w-10 h-10 rotate-45" />
            </div>
            <h1 className="text-3xl font-black tracking-tight italic text-[#1F4E5F] mb-2">
              Kos Putra Friendly
            </h1>
            <p className="text-[#1F4E5F]/60 text-sm font-medium leading-relaxed max-w-[280px] mx-auto">
              Pilihan tepat hunian nyaman dan strategis untuk putra di Yogyakarta.
            </p>
          </div>
        </header>

        <div className="px-6 space-y-10 mt-8">
          {/* Alamat Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-[#1F4E5F]/40 uppercase tracking-widest text-[10px] font-black">
              <MapPin className="w-3 h-3" />
              Alamat
            </div>
            <div className="bg-white p-5 rounded-3xl border border-[#F4E7D3] shadow-sm">
              <p className="text-sm font-bold leading-relaxed text-[#1F4E5F]">
                Jl. Sembada No.2, Kledokan, Caturtunggal, Kec. Depok, Kabupaten Sleman, Daerah Istimewa Yogyakarta 55281
              </p>
            </div>
          </section>

          {/* Room Types */}
          <section className="space-y-4">
            <h2 className="text-xl font-black italic text-[#1F4E5F]">Available Rooms</h2>
            <div className="space-y-4">
              {loadingRooms ? (
                [1, 2].map((i) => (
                  <div key={i} className="h-48 bg-white/50 animate-pulse rounded-[32px] border border-[#F4E7D3]" />
                ))
              ) : rooms.length === 0 ? (
                <div className="bg-white p-8 rounded-[32px] border border-dashed border-[#F4E7D3] text-center">
                  <p className="text-sm font-bold text-[#1F4E5F]/40">Maaf, saat ini semua kamar penuh.</p>
                </div>
              ) : (
                rooms.map((room) => (
                  <div key={room.id} className="bg-white overflow-hidden rounded-[32px] border border-[#F4E7D3] shadow-sm flex flex-col group">
                    <div className="h-48 bg-[#F9F8ED] relative flex items-center justify-center text-[#1F4E5F]/10">
                      {room.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={room.imageUrl} alt={`Kamar ${room.number}`} className="w-full h-full object-cover" />
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-black text-[#1F4E5F]">Kamar {room.number} ({room.category})</h3>
                      <p className="text-xs font-medium text-[#1F4E5F]/50 mb-4">{room.facilities || 'Fasilitas lengkap untuk kenyamanan Anda'}</p>
                      <div className="flex items-center justify-between">
                        <div className="text-[#0881A3] font-black text-lg">
                          Rp {room.priceMonthly.toLocaleString('id-ID')} <span className="text-[10px] font-medium text-[#1F4E5F]/40">/ bulan</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-[#0881A3]" />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Spesifikasi Section */}
          <section className="space-y-6 bg-white p-8 rounded-[40px] border border-[#F4E7D3] shadow-sm">
            <div className="space-y-4">
              <h2 className="text-xl font-black italic text-[#1F4E5F]">Spesifikasi tipe kamar</h2>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 bg-[#F9F8ED] rounded-xl flex items-center justify-center text-[#0881A3] group-hover:bg-[#0881A3] group-hover:text-white transition-colors">
                    <Maximize2 className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-bold text-[#1F4E5F]">3 x 3 meter</span>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 bg-[#F9F8ED] rounded-xl flex items-center justify-center text-[#0881A3] group-hover:bg-[#0881A3] group-hover:text-white transition-colors">
                    <ZapOff className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-bold text-[#1F4E5F]">Tidak termasuk listrik</span>
                </div>
              </div>
            </div>

            <div className="h-px bg-[#F4E7D3]" />

            <div className="space-y-4">
              <h2 className="text-xl font-black italic text-[#1F4E5F]">Fasilitas kamar mandi</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#F9F8ED] rounded-xl flex items-center justify-center text-[#0881A3]">
                    <Bath className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-[#1F4E5F]">K. Mandi Dalam</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#F9F8ED] rounded-xl flex items-center justify-center text-[#0881A3]">
                    <Wind className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-[#1F4E5F]">Shower</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#F9F8ED] rounded-xl flex items-center justify-center text-[#0881A3]">
                    <Bath className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-[#1F4E5F]">Kloset Jongkok</span>
                </div>
              </div>
            </div>
          </section>

          {/* Tempat Terdekat Section */}
          <section className="space-y-6">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('nearby')}
                className={`px-4 py-2 rounded-full text-xs font-black transition-all ${activeTab === 'nearby' ? 'bg-[#1F4E5F] text-white shadow-md' : 'bg-white text-[#1F4E5F]/40 border border-[#F4E7D3]'}`}
              >
                Tempat Terdekat
              </button>
              <button
                onClick={() => setActiveTab('transport')}
                className={`px-4 py-2 rounded-full text-xs font-black transition-all ${activeTab === 'transport' ? 'bg-[#1F4E5F] text-white shadow-md' : 'bg-white text-[#1F4E5F]/40 border border-[#F4E7D3]'}`}
              >
                Transportasi
              </button>
            </div>

            <div className="bg-white p-6 rounded-[40px] border border-[#F4E7D3] shadow-sm">
              <div className="space-y-6">
                {activeTab === 'nearby' ? (
                  nearbyPlaces.map((place, idx) => (
                    <div key={idx} className="flex items-center justify-between group">
                      <div className="flex items-center gap-4 text-[#1F4E5F]">
                        <div className="w-10 h-10 bg-[#F9F8ED] rounded-xl flex items-center justify-center group-hover:bg-[#0881A3] group-hover:text-white transition-colors">
                          <place.icon className="w-5 h-5" />
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-sm font-bold leading-tight">{place.name}</p>
                          <p className="text-[10px] font-medium text-[#1F4E5F]/40">{place.distance}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-10 text-center">
                    <Navigation className="w-10 h-10 text-[#1F4E5F]/10 mx-auto mb-4" />
                    <p className="text-xs font-bold text-[#1F4E5F]/40">Data transportasi segera hadir.</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>

        <footer className="mt-20 pb-10 text-center px-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-[#1F4E5F]/20">
            &copy; 2026 Kos Putra Friendly App • Sleman, Yogyakarta
          </p>
        </footer>
      </div>

      {/* Sticky Bottom CTA Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-6 z-50 pointer-events-none">
        <div className="mx-auto max-w-md bg-white/80 backdrop-blur-xl border border-[#F4E7D3] p-4 rounded-3xl shadow-2xl flex gap-3 pointer-events-auto">
          <Link
            href="/login"
            className="flex-1 bg-[#0881A3] text-white rounded-2xl py-4 text-center text-sm font-black italic tracking-tight shadow-lg shadow-[#0881A3]/20 transition-all hover:brightness-110 active:scale-[0.98]"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="flex-1 bg-white text-[#1F4E5F] border-2 border-[#1F4E5F] rounded-2xl py-4 text-center text-sm font-black italic tracking-tight transition-all hover:bg-[#1F4E5F] hover:text-white active:scale-[0.98]"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
