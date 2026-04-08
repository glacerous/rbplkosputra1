'use client';

import { useEffect, useState } from 'react';
import { Loader2, Pencil, Trash2, Check, X, Search } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

const ROLES = ['ADMIN', 'OWNER', 'CUSTOMER', 'CLEANER'];

const roleBadgeClass: Record<string, string> = {
  ADMIN: 'bg-red-100 text-red-700',
  OWNER: 'bg-purple-100 text-purple-700',
  CUSTOMER: 'bg-blue-100 text-blue-700',
  CLEANER: 'bg-emerald-100 text-emerald-700',
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', role: '' });
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('/api/admin/users')
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const startEdit = (user: User) => {
    setEditingId(user.id);
    setEditForm({ name: user.name, role: user.role });
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = async (id: string) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Gagal memperbarui user');
      }
      const updated = await res.json();
      setUsers(
        users.map((u) =>
          u.id === id ? { ...u, name: updated.name, role: updated.role } : u,
        ),
      );
      setEditingId(null);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus user ini?')) return;
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Gagal menghapus user');
      }
      setUsers(users.filter((u) => u.id !== id));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Terjadi kesalahan');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-[#0881A3]" />
      </div>
    );
  }

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <p className="text-[10px] font-black tracking-[0.3em] text-[#0881A3] uppercase">
          Manajemen
        </p>
        <h1 className="text-4xl font-black tracking-tighter text-[#1F4E5F] italic">
          Daftar Penyewa
        </h1>
      </div>

      <div className="relative">
        <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-[#1F4E5F]/40" />
        <input
          type="text"
          placeholder="Cari nama atau email..."
          className="w-full rounded-2xl border border-[#F4E7D3] bg-white py-4 pr-4 pl-12 font-medium transition-all outline-none focus:ring-2 focus:ring-[#0881A3]/20"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-hidden rounded-3xl border border-[#F4E7D3] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#F4E7D3] bg-[#F9F8ED]">
                <th className="px-6 py-4 text-left text-[10px] font-black tracking-widest text-[#1F4E5F]/50 uppercase">
                  Nama
                </th>
                <th className="px-6 py-4 text-left text-[10px] font-black tracking-widest text-[#1F4E5F]/50 uppercase">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-[10px] font-black tracking-widest text-[#1F4E5F]/50 uppercase">
                  Peran
                </th>
                <th className="px-6 py-4 text-left text-[10px] font-black tracking-widest text-[#1F4E5F]/50 uppercase">
                  Bergabung
                </th>
                <th className="px-6 py-4 text-right text-[10px] font-black tracking-widest text-[#1F4E5F]/50 uppercase">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-[#F4E7D3] transition-colors last:border-0 hover:bg-[#F9F8ED]/50"
                >
                  <td className="px-6 py-4">
                    {editingId === user.id ? (
                      <input
                        type="text"
                        className="w-full rounded-xl border border-[#F4E7D3] bg-[#F9F8ED] px-3 py-1.5 text-sm font-medium outline-none focus:ring-2 focus:ring-[#0881A3]/20"
                        value={editForm.name}
                        onChange={(e) =>
                          setEditForm({ ...editForm, name: e.target.value })
                        }
                      />
                    ) : (
                      <span className="text-sm font-bold">{user.name}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-[#1F4E5F]/60">
                      {user.email}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {editingId === user.id ? (
                      <select
                        className="rounded-xl border border-[#F4E7D3] bg-[#F9F8ED] px-3 py-1.5 text-sm font-medium outline-none focus:ring-2 focus:ring-[#0881A3]/20"
                        value={editForm.role}
                        onChange={(e) =>
                          setEditForm({ ...editForm, role: e.target.value })
                        }
                      >
                        {ROLES.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-black tracking-wider uppercase ${roleBadgeClass[user.role] ?? 'bg-gray-100 text-gray-600'}`}
                      >
                        {user.role}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-medium text-[#1F4E5F]/40">
                      {new Date(user.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {editingId === user.id ? (
                        <>
                          <button
                            onClick={() => saveEdit(user.id)}
                            disabled={saving}
                            className="flex items-center gap-1 rounded-xl bg-[#0881A3] px-3 py-1.5 text-xs font-bold text-white transition-all hover:brightness-110 disabled:opacity-50"
                          >
                            {saving ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Check className="h-3 w-3" />
                            )}
                            Simpan
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="flex items-center gap-1 rounded-xl border border-[#F4E7D3] bg-white px-3 py-1.5 text-xs font-bold text-[#1F4E5F]/60 transition-all hover:bg-[#F4E7D3]/50"
                          >
                            <X className="h-3 w-3" />
                            Batal
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEdit(user)}
                            className="flex items-center gap-1 rounded-xl border border-[#F4E7D3] bg-white px-3 py-1.5 text-xs font-bold text-[#1F4E5F] transition-all hover:bg-[#F4E7D3]/50"
                          >
                            <Pencil className="h-3 w-3" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="flex items-center gap-1 rounded-xl border border-red-100 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 transition-all hover:bg-red-100"
                          >
                            <Trash2 className="h-3 w-3" />
                            Hapus
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <div className="py-16 text-center">
              <p className="font-bold text-[#1F4E5F]/30 italic">
                {searchTerm
                  ? 'Tidak ada user yang sesuai pencarian.'
                  : 'Belum ada user terdaftar.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
