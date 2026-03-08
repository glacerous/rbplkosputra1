'use client';

import { useEffect, useRef, useState } from 'react';
import { Bell, CheckCheck, X } from 'lucide-react';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  readAt: string | null;
  createdAt: string;
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const fetchNotifications = () => {
    fetch('/api/public/notifications')
      .then((r) => r.json())
      .then((data) => setNotifications(Array.isArray(data) ? data : []))
      .catch(console.error);
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30_000);
    return () => clearInterval(interval);
  }, []);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const unread = notifications.filter((n) => !n.readAt).length;

  const markRead = async (id: string) => {
    try {
      await fetch(`/api/public/notifications/${id}/read`, { method: 'PATCH' });
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, readAt: new Date().toISOString() } : n,
        ),
      );
    } catch (e) {
      console.error(e);
    }
  };

  const markAllRead = async () => {
    const unreadIds = notifications.filter((n) => !n.readAt).map((n) => n.id);
    await Promise.all(unreadIds.map(markRead));
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-9 w-9 items-center justify-center rounded-full border border-[#F4E7D3] bg-white transition-colors hover:bg-[#F9F8ED]"
        aria-label="Notifikasi"
      >
        <Bell className="h-4 w-4 text-[#1F4E5F]" />
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-black text-white">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-2xl border border-[#F4E7D3] bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-[#F4E7D3] px-4 py-3">
            <span className="text-xs font-black uppercase tracking-widest text-[#1F4E5F]">
              Notifikasi
            </span>
            <div className="flex items-center gap-2">
              {unread > 0 && (
                <button
                  onClick={markAllRead}
                  className="flex items-center gap-1 text-[10px] font-bold text-[#0881A3] hover:underline"
                >
                  <CheckCheck className="h-3 w-3" />
                  Baca semua
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="text-[#1F4E5F]/40 hover:text-[#1F4E5F]"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-xs font-medium text-[#1F4E5F]/40">
                Belum ada notifikasi.
              </div>
            ) : (
              notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => !n.readAt && markRead(n.id)}
                  className={`w-full border-b border-[#F4E7D3] px-4 py-3 text-left last:border-0 transition-colors ${
                    n.readAt
                      ? 'bg-white'
                      : 'bg-[#EAF7FB] hover:bg-[#d6f0f7]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-black text-[#1F4E5F]">
                      {n.title}
                    </p>
                    {!n.readAt && (
                      <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-[#0881A3]" />
                    )}
                  </div>
                  <p className="mt-0.5 text-[11px] font-medium leading-snug text-[#1F4E5F]/60">
                    {n.message}
                  </p>
                  <p className="mt-1 text-[10px] text-[#1F4E5F]/30">
                    {new Date(n.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
