import { Skeleton } from '@/components/shadcn/ui/skeleton'

export default function RootGroupLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8">
          {/* Header Section Skeleton */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1.5">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>

          {/* Main Content Skeleton */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Posts Section Skeleton */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
            </div>

            {/* Sidebar Skeleton */}
            <div className="hidden lg:block">
              <div className="space-y-4">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-64 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 