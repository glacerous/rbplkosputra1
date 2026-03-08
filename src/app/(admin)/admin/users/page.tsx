"use client";

import { useEffect, useState } from "react";
import { Loader2, Pencil, Trash2, Check, X } from "lucide-react";

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
}

const ROLES = ["ADMIN", "OWNER", "CUSTOMER", "CLEANER"];

const roleBadgeClass: Record<string, string> = {
    ADMIN: "bg-red-100 text-red-700",
    OWNER: "bg-purple-100 text-purple-700",
    CUSTOMER: "bg-blue-100 text-blue-700",
    CLEANER: "bg-emerald-100 text-emerald-700",
};

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState({ name: "", role: "" });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetch("/api/admin/users")
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
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editForm),
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Gagal memperbarui user");
            }
            const updated = await res.json();
            setUsers(users.map((u) => (u.id === id ? { ...u, name: updated.name, role: updated.role } : u)));
            setEditingId(null);
        } catch (err: any) {
            alert(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Yakin ingin menghapus user ini?")) return;
        try {
            const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Gagal menghapus user");
            }
            setUsers(users.filter((u) => u.id !== id));
        } catch (err: any) {
            alert(err.message);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-[#0881A3]" />
            </div>
        );
    }

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

            <div className="bg-white rounded-3xl border border-[#F4E7D3] overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[#F4E7D3] bg-[#F9F8ED]">
                                <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#1F4E5F]/50">Nama</th>
                                <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#1F4E5F]/50">Email</th>
                                <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#1F4E5F]/50">Peran</th>
                                <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#1F4E5F]/50">Bergabung</th>
                                <th className="text-right px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#1F4E5F]/50">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="border-b border-[#F4E7D3] last:border-0 hover:bg-[#F9F8ED]/50 transition-colors">
                                    <td className="px-6 py-4">
                                        {editingId === user.id ? (
                                            <input
                                                type="text"
                                                className="bg-[#F9F8ED] border border-[#F4E7D3] rounded-xl px-3 py-1.5 text-sm font-medium outline-none focus:ring-2 focus:ring-[#0881A3]/20 w-full"
                                                value={editForm.name}
                                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                            />
                                        ) : (
                                            <span className="font-bold text-sm">{user.name}</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-[#1F4E5F]/60 font-medium">{user.email}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {editingId === user.id ? (
                                            <select
                                                className="bg-[#F9F8ED] border border-[#F4E7D3] rounded-xl px-3 py-1.5 text-sm font-medium outline-none focus:ring-2 focus:ring-[#0881A3]/20"
                                                value={editForm.role}
                                                onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                                            >
                                                {ROLES.map((r) => (
                                                    <option key={r} value={r}>{r}</option>
                                                ))}
                                            </select>
                                        ) : (
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${roleBadgeClass[user.role] ?? "bg-gray-100 text-gray-600"}`}>
                                                {user.role}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs text-[#1F4E5F]/40 font-medium">
                                            {new Date(user.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            {editingId === user.id ? (
                                                <>
                                                    <button
                                                        onClick={() => saveEdit(user.id)}
                                                        disabled={saving}
                                                        className="flex items-center gap-1 bg-[#0881A3] text-white px-3 py-1.5 rounded-xl text-xs font-bold hover:brightness-110 transition-all disabled:opacity-50"
                                                    >
                                                        {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                                                        Simpan
                                                    </button>
                                                    <button
                                                        onClick={cancelEdit}
                                                        className="flex items-center gap-1 bg-white border border-[#F4E7D3] text-[#1F4E5F]/60 px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-[#F4E7D3]/50 transition-all"
                                                    >
                                                        <X className="w-3 h-3" />
                                                        Batal
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => startEdit(user)}
                                                        className="flex items-center gap-1 bg-white border border-[#F4E7D3] text-[#1F4E5F] px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-[#F4E7D3]/50 transition-all"
                                                    >
                                                        <Pencil className="w-3 h-3" />
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(user.id)}
                                                        className="flex items-center gap-1 bg-red-50 border border-red-100 text-red-600 px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-red-100 transition-all"
                                                    >
                                                        <Trash2 className="w-3 h-3" />
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

                    {users.length === 0 && (
                        <div className="py-16 text-center">
                            <p className="text-[#1F4E5F]/30 font-bold italic">Belum ada user terdaftar.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
