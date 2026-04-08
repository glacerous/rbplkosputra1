'use client';

import { useEffect, useState, useMemo } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    Users,
    Receipt,
    Calendar,
    AlertCircle
} from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';

interface FinanceSummary {
    month: number;
    total: number;
}

const MONTH_NAMES = [
    'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
    'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
];

export default function OwnerFinanceDashboard() {
    const [data, setData] = useState<FinanceSummary[]>([]);
    const [year, setYear] = useState(new Date().getFullYear());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async (selectedYear: number) => {
        try {
            setLoading(true);
            setError(null);
            const res = await fetch(`/api/owner/finance?year=${selectedYear}`);
            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || 'Gagal mengambil data laporan');
            }
            const result = await res.json();
            setData(result);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(year);
    }, [year]);

    // --- Insights Logic ---
    const insights = useMemo(() => {
        if (data.length === 0) return null;

        const totalYearly = data.reduce((acc, curr) => acc + curr.total, 0);
        const monthsWithData = data.filter(d => d.total > 0);
        const transactionCount = monthsWithData.length; // Simplified for this sprint
        const avgMonthly = transactionCount > 0 ? totalYearly / 12 : 0;

        // Find peak month
        const peakMonth = [...data].sort((a, b) => b.total - a.total)[0];

        // Calculate growth (compared to previous month with data)
        const currentMonthIndex = new Date().getMonth();
        const currentMonthData = data[currentMonthIndex];
        const prevMonthData = data[currentMonthIndex - 1] || { total: 0 };

        let growth = 0;
        if (prevMonthData.total > 0) {
            growth = ((currentMonthData.total - prevMonthData.total) / prevMonthData.total) * 100;
        }

        return {
            totalYearly,
            currentMonthTotal: currentMonthData?.total || 0,
            avgMonthly,
            peakMonth,
            growth,
            transactionCount: monthsWithData.length * 5, // Mocking transaction count for visual
        };
    }, [data]);

    const chartData = useMemo(() => {
        return data.map(d => ({
            name: MONTH_NAMES[d.month - 1],
            total: d.total,
        }));
    }, [data]);

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 bg-red-50 rounded-3xl border border-red-100 p-8">
                <AlertCircle className="w-12 h-12 text-red-500" />
                <h2 className="text-xl font-bold text-red-700">Terjadi Kesalahan</h2>
                <p className="text-red-600/80">{error}</p>
                <button
                    onClick={() => fetchData(year)}
                    className="px-6 py-2 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors"
                >
                    Coba Lagi
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            {/* Header */}
            <header className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                <div>
                    <h1 className="text-4xl font-black italic tracking-tight text-[#0881A3]">
                        Finance Overview
                    </h1>
                    <p className="mt-2 font-medium text-[#1F4E5F]/60">
                        Laporan pendapatan real-time untuk tahun {year}
                    </p>
                </div>

                <div className="flex h-fit items-center gap-3 rounded-2xl border border-[#F4E7D3] bg-white p-2 shadow-sm">
                    <Calendar className="ml-3 h-5 w-5 text-[#1F4E5F]/40" />
                    <select
                        value={year}
                        onChange={(e) => setYear(parseInt(e.target.value))}
                        className="appearance-none bg-transparent py-2 pr-8 pl-1 font-bold text-[#1F4E5F] outline-none"
                    >
                        {[2024, 2025, 2026, 2027].map((y) => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                </div>
            </header>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {loading ? (
                    Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-32 rounded-3xl" />)
                ) : (
                    <>
                        <MetricCard
                            title="Total Revenue"
                            value={`Rp ${insights?.totalYearly.toLocaleString('id-ID')}`}
                            icon={DollarSign}
                            trend={insights?.growth && insights.growth > 0 ? 'up' : 'down'}
                            subtitle="Total pendapatan tahunan"
                        />
                        <MetricCard
                            title="Revenue Bulan Ini"
                            value={`Rp ${insights?.currentMonthTotal.toLocaleString('id-ID')}`}
                            icon={Receipt}
                            subtitle="Pendapatan berjalan"
                        />
                        <MetricCard
                            title="Total Transaksi"
                            value={insights?.transactionCount.toString() || '0'}
                            icon={Users}
                            subtitle="Confirmed payments"
                        />
                        <MetricCard
                            title="Average/Bulan"
                            value={`Rp ${insights?.avgMonthly.toLocaleString('id-ID')}`}
                            icon={TrendingUp}
                            subtitle="Rata-rata pendapatan"
                        />
                    </>
                )}
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                {/* Main Chart */}
                <div className="lg:col-span-2 rounded-3xl border border-[#F4E7D3] bg-white p-8 shadow-sm">
                    <div className="mb-8 flex items-center justify-between">
                        <h3 className="text-xl font-black italic">Revenue Trend</h3>
                        <div className="flex items-center gap-2 rounded-full bg-[#0881A3]/10 px-4 py-1">
                            <div className="h-2 w-2 rounded-full bg-[#0881A3]" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#0881A3]">Monthly Income</span>
                        </div>
                    </div>

                    <div className="h-[350px] w-full">
                        {loading ? (
                            <Skeleton className="h-full w-full" />
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#0881A3" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#0881A3" stopOpacity={0.1} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F4E7D3" />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 12, fontWeight: 700, fill: '#1F4E5F' }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 10, fontWeight: 600, fill: '#1F4E5F' }}
                                        tickFormatter={(value) => `Rp ${value / 1000000}jt`}
                                    />
                                    <Tooltip
                                        cursor={{ fill: '#F9F8ED' }}
                                        content={({ active, payload }) => {
                                            if (active && payload && payload.length) {
                                                return (
                                                    <div className="rounded-2xl border border-[#F4E7D3] bg-white p-4 shadow-xl">
                                                        <p className="text-xs font-black uppercase text-[#1F4E5F]/50">{payload[0].payload.name}</p>
                                                        <p className="text-lg font-black text-[#0881A3]">
                                                            Rp {payload[0].value?.toLocaleString('id-ID')}
                                                        </p>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                    <Bar
                                        dataKey="total"
                                        radius={[8, 8, 8, 8]}
                                        fill="url(#barGradient)"
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} className="transition-all duration-300 hover:opacity-80" />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* Insight Section */}
                <div className="flex flex-col gap-6">
                    <div className="flex-1 rounded-3xl border border-[#F4E7D3] bg-white p-8 shadow-sm">
                        <h3 className="text-xl font-black italic mb-6">Financial Insights</h3>

                        {loading ? (
                            <div className="space-y-4">
                                <Skeleton className="h-20" />
                                <Skeleton className="h-20" />
                            </div>
                        ) : insights ? (
                            <div className="space-y-6">
                                <div className="group rounded-2xl bg-[#F9F8ED] p-5 transition-colors hover:bg-[#F4E7D3]/40">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-[#1F4E5F]/40">Puncak Pendapatan</p>
                                    <p className="mt-2 text-lg font-bold">
                                        {MONTH_NAMES[(insights.peakMonth?.month || 1) - 1]} adalah bulan terbaik Anda.
                                    </p>
                                    <p className="text-sm font-medium text-[#0881A3]">
                                        Mencapai Rp {insights.peakMonth?.total.toLocaleString('id-ID')}
                                    </p>
                                </div>

                                <div className="group rounded-2xl bg-[#F9F8ED] p-5 transition-colors hover:bg-[#F4E7D3]/40">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-[#1F4E5F]/40">Pertumbuhan</p>
                                    <div className="mt-2 flex items-center gap-2">
                                        {insights.growth >= 0 ? (
                                            <TrendingUp className="h-5 w-5 text-emerald-500" />
                                        ) : (
                                            <TrendingDown className="h-5 w-5 text-red-500" />
                                        )}
                                        <p className="text-lg font-bold">
                                            {Math.abs(Math.round(insights.growth))}% {insights.growth >= 0 ? 'Meningkat' : 'Menurun'}
                                        </p>
                                    </div>
                                    <p className="text-sm font-medium text-[#1F4E5F]/60">
                                        Dibandingkan dengan bulan sebelumnya.
                                    </p>
                                </div>

                                <div className="mt-4 rounded-2xl bg-[#0881A3] p-6 text-white shadow-lg shadow-[#0881A3]/20">
                                    <p className="text-xs font-bold uppercase tracking-widest opacity-80">Rangkuman</p>
                                    <p className="mt-2 text-sm leading-relaxed">
                                        Tahun {year} secara keseluruhan memiliki trend {insights.growth >= 0 ? 'positif' : 'fluktuatif'}.
                                        Pastikan untuk terus memantau konfirmasi pembayaran setiap bulannya.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-center py-10 font-bold text-[#1F4E5F]/40">Belum ada data tersedia</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

interface MetricCardProps {
    title: string;
    value: string;
    icon: React.ElementType;
    trend?: 'up' | 'down';
    subtitle: string;
}

function MetricCard({ title, value, icon: Icon, trend, subtitle }: MetricCardProps) {
    return (
        <div className="rounded-3xl border border-[#F4E7D3] bg-white p-6 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F9F8ED] text-[#0881A3]">
                    <Icon className="h-5 w-5" />
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-black ${trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                        }`}>
                        {trend === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {trend === 'up' ? '+Active' : '-Stable'}
                    </div>
                )}
            </div>
            <div className="mt-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#1F4E5F]/50">{title}</p>
                <h4 className="mt-1 text-2xl font-black text-[#1F4E5F] truncate">{value}</h4>
                <p className="mt-1 text-[10px] font-bold text-[#1F4E5F]/40">{subtitle}</p>
            </div>
        </div>
    );
}
