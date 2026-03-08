import { Skeleton, SkeletonText } from "@/components/ui/Skeleton";

export default function ReservationsSkeleton() {
    return (
        <div className="min-h-screen bg-surface font-sans text-primary-dark px-4 py-12 sm:px-6 pb-6">
            <div className="max-w-2xl mx-auto space-y-8">
                <div className="flex items-center gap-4">
                    <Skeleton className="w-10 h-10 rounded-2xl shrink-0" />
                    <div className="space-y-2">
                        <SkeletonText className="w-48 h-6 rounded" />
                        <SkeletonText className="w-36 h-4 rounded" />
                    </div>
                </div>
                <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="bg-white rounded-[32px] border border-[#F4E7D3] p-6 space-y-4 shadow-sm">
                            <div className="flex items-center justify-between gap-2">
                                <SkeletonText className="w-28 h-4 rounded" />
                                <SkeletonText className="w-20 h-6 rounded-full" />
                            </div>
                            <SkeletonText className="w-36 h-5 rounded" />
                            <SkeletonText className="w-44 h-3.5 rounded" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
