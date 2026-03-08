import { Skeleton, SkeletonText } from "@/components/ui/Skeleton";

export default function HomePageSkeleton() {
    return (
        <div className="min-h-screen bg-[#F9F8ED] font-['Balsamiq_Sans'] text-[#1F4E5F] px-4 py-8 sm:px-6">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between gap-4">
                    <div className="space-y-2 flex-1">
                        <SkeletonText className="w-48 h-8 rounded-lg" />
                        <SkeletonText className="w-64 h-4" />
                    </div>
                    <Skeleton className="w-24 h-10 rounded-xl" />
                </div>

                {/* Main content area */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <Skeleton className="col-span-1 md:col-span-2 h-64 rounded-2xl" />
                    <div className="space-y-4">
                        <Skeleton className="h-40 rounded-2xl" />
                        <Skeleton className="h-32 rounded-2xl" />
                    </div>
                </div>
            </div>
        </div>
    );
}
