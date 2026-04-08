'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2, ImagePlus } from 'lucide-react';
import Image from 'next/image';

export default function CreateRoomPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Record<string, string[]> | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const previewUrlRef = useRef<string | null>(null);

  const [formData, setFormData] = useState({
    number: '',
    category: '',
    priceMonthly: 0,
    facilities: '',
    status: 'AVAILABLE',
  });

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    };
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    setImageFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      previewUrlRef.current = url;
      setImagePreview(url);
    } else {
      previewUrlRef.current = null;
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const fd = new FormData();
      fd.append('number', formData.number);
      fd.append('category', formData.category);
      fd.append('priceMonthly', String(formData.priceMonthly));
      fd.append('facilities', formData.facilities);
      fd.append('status', formData.status);
      if (imageFile) fd.append('image', imageFile);

      const res = await fetch('/api/admin/rooms', {
        method: 'POST',
        body: fd,
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 400 && data.errors) {
          setError(data.errors);
        } else {
          throw new Error(data.message || 'Gagal membuat kamar');
        }
        return;
      }

      router.push('/admin/rooms');
      router.refresh();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Gagal membuat kamar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <header className="flex items-center justify-between">
        <Link
          href="/admin/rooms"
          className="flex items-center gap-2 font-bold text-[#1F4E5F]/60 transition-colors hover:text-[#1F4E5F]"
        >
          <ArrowLeft className="h-5 w-5" />
          Kembali
        </Link>
        <h1 className="text-2xl font-black italic">Tambah Kamar</h1>
      </header>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-3xl border border-[#F4E7D3] bg-white p-8 shadow-sm"
      >
        <div className="space-y-2">
          <label className="text-sm font-black tracking-wider uppercase">
            Nomor Kamar
          </label>
          <input
            type="text"
            required
            className="w-full rounded-2xl border border-[#F4E7D3] bg-[#F9F8ED] px-6 py-4 font-medium transition-all outline-none focus:ring-2 focus:ring-[#0881A3]/20"
            placeholder="Contoh: A01"
            value={formData.number}
            onChange={(e) =>
              setFormData({ ...formData, number: e.target.value })
            }
          />
          {error?.number && (
            <p className="text-xs font-bold text-red-500">{error.number[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-black tracking-wider uppercase">
            Kategori
          </label>
          <input
            type="text"
            required
            className="w-full rounded-2xl border border-[#F4E7D3] bg-[#F9F8ED] px-6 py-4 font-medium transition-all outline-none focus:ring-2 focus:ring-[#0881A3]/20"
            placeholder="Contoh: Deluxe, Standard"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          />
          {error?.category && (
            <p className="text-xs font-bold text-red-500">
              {error.category[0]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-black tracking-wider uppercase">
            Harga per Bulan (Rp)
          </label>
          <input
            type="number"
            required
            min="0"
            className="w-full rounded-2xl border border-[#F4E7D3] bg-[#F9F8ED] px-6 py-4 font-medium transition-all outline-none focus:ring-2 focus:ring-[#0881A3]/20"
            value={formData.priceMonthly}
            onChange={(e) =>
              setFormData({
                ...formData,
                priceMonthly: parseInt(e.target.value),
              })
            }
          />
          {error?.priceMonthly && (
            <p className="text-xs font-bold text-red-500">
              {error.priceMonthly[0]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-black tracking-wider uppercase">
            Fasilitas (Opsional)
          </label>
          <textarea
            className="min-h-[120px] w-full rounded-2xl border border-[#F4E7D3] bg-[#F9F8ED] px-6 py-4 font-medium transition-all outline-none focus:ring-2 focus:ring-[#0881A3]/20"
            placeholder="Sebutkan fasilitas kamar..."
            value={formData.facilities}
            onChange={(e) =>
              setFormData({ ...formData, facilities: e.target.value })
            }
          ></textarea>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-black tracking-wider uppercase">
            Foto Kamar (Opsional)
          </label>
          <label className="flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#F4E7D3] bg-[#F9F8ED] p-6 transition-all hover:border-[#0881A3]/40">
            <ImagePlus className="h-6 w-6 text-[#1F4E5F]/30" />
            <span className="text-xs font-medium text-[#1F4E5F]/40">
              {imageFile
                ? imageFile.name
                : 'Klik untuk pilih gambar (JPEG, PNG, WebP, maks 5MB)'}
            </span>
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
          {imagePreview && (
            <div className="relative mt-2 h-40 w-full overflow-hidden rounded-2xl">
              <Image
                src={imagePreview}
                alt="Preview"
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-black tracking-wider uppercase">
            Status
          </label>
          <select
            className="w-full rounded-2xl border border-[#F4E7D3] bg-[#F9F8ED] px-6 py-4 font-medium transition-all outline-none focus:ring-2 focus:ring-[#0881A3]/20"
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
          >
            <option value="AVAILABLE">AVAILABLE</option>
            <option value="OCCUPIED">OCCUPIED</option>
            <option value="MAINTENANCE">MAINTENANCE</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0881A3] py-4 font-black tracking-widest text-white uppercase shadow-lg shadow-[#0881A3]/20 transition-all hover:bg-[#066a85] disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Memproses...
            </>
          ) : (
            <>
              <Save className="h-5 w-5" />
              Simpan Kamar
            </>
          )}
        </button>
      </form>
    </div>
  );
}
