import { Skeleton, SkeletonText } from "@/components/ui/Skeleton";

export default function RoomsListSkeleton() {
    return (
        <div className="min-h-screen bg-surface text-primary-dark font-sans px-4 py-8 sm:py-16 sm:px-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-12 text-center space-y-4">
                    <SkeletonText className="w-64 h-10 mx-auto rounded-xl" />
                    <SkeletonText className="w-96 h-5 mx-auto" />
                </div>

                {/* 3-column card grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="rounded-2xl overflow-hidden border border-primary-dark/10">
                            {/* Thumbnail */}
                            <Skeleton className="aspect-[16/10] rounded-none" />
                            {/* Card body */}
                            <div className="p-6 space-y-4 bg-warm-surface">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-2">
                                        <SkeletonText className="w-32 h-5 rounded" />
                                        <SkeletonText className="w-20 h-3.5 rounded" />
                                    </div>
                                    <SkeletonText className="w-24 h-5 rounded" />
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <SkeletonText className="w-16 h-6 rounded" />
                                    <SkeletonText className="w-12 h-6 rounded" />
                                    <SkeletonText className="w-20 h-6 rounded" />
                                </div>
                                <Skeleton className="w-full h-11 rounded-xl" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
