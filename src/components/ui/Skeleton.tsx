import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
    return (
        <div className={cn("animate-pulse rounded-md bg-[#1F4E5F]/8", className)} />
    );
}

export function SkeletonText({ className }: { className?: string }) {
    return (
        <div className={cn("animate-pulse rounded bg-[#1F4E5F]/8 h-4", className)} />
    );
}

export function SkeletonCard({ className, children }: { className?: string; children?: React.ReactNode }) {
    return (
        <div className={cn("animate-pulse rounded-2xl bg-[#1F4E5F]/8", className)}>
            {children}
        </div>
    );
}
