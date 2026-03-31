import { cn } from '@/lib/utils';

interface LoadingSkeletonProps {
  variant?: 'table' | 'cards' | 'stats';
  count?: number;
}

const SkeletonLine = ({ className }: { className?: string }) => (
  <div className={cn("h-4 rounded-md bg-muted animate-pulse", className)} />
);

export const LoadingSkeleton = ({ variant = 'table', count = 5 }: LoadingSkeletonProps) => {
  if (variant === 'stats') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="surface-card p-6 space-y-3">
            <SkeletonLine className="h-3 w-20" />
            <SkeletonLine className="h-8 w-16" />
            <SkeletonLine className="h-3 w-28" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'cards') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="surface-card p-6 space-y-4">
            <SkeletonLine className="h-5 w-3/4" />
            <SkeletonLine className="h-4 w-1/2" />
            <SkeletonLine className="h-4 w-full" />
            <div className="flex gap-2">
              <SkeletonLine className="h-6 w-16 rounded-full" />
              <SkeletonLine className="h-6 w-20 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="surface-card overflow-hidden">
      <div className="p-4 space-y-1">
        <SkeletonLine className="h-4 w-full" />
      </div>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="px-4 py-3 flex gap-4 border-t border-border">
          <SkeletonLine className="h-4 w-1/4" />
          <SkeletonLine className="h-4 w-1/3" />
          <SkeletonLine className="h-4 w-1/5" />
          <SkeletonLine className="h-4 w-1/6" />
        </div>
      ))}
    </div>
  );
};
