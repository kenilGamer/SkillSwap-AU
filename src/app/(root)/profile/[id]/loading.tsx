import { Skeleton } from '@/components/shadcn/ui/skeleton'

export default function ProfileLoading() {
  return (
    <div className="flex w-full flex-col items-center bg-gradient-to-b from-indigo-50 to-white min-h-screen py-8 px-2">
      {/* Banner/Cover Skeleton */}
      <div className="w-full max-w-2xl h-32 rounded-2xl bg-gradient-to-r from-indigo-400 to-indigo-600 mb-[-67px] shadow-lg relative">
        <div className="absolute left-1/2 -bottom-16 -translate-x-1/2">
          <Skeleton className="h-32 w-32 rounded-full" />
        </div>
      </div>

      {/* Card Skeleton */}
      <div className="w-full max-w-2xl mt-20 rounded-2xl bg-white/80 border border-slate-100 shadow-xl p-8 flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-center md:gap-8 gap-4 items-center">
          <div className="flex-1 text-center md:text-left">
            <Skeleton className="h-8 w-48 mx-auto md:mx-0" />
            <div className="flex flex-wrap gap-4 justify-center md:justify-start mt-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-40" />
            </div>
            <Skeleton className="h-10 w-32 mt-4 mx-auto md:mx-0" />
          </div>
        </div>

        <hr className="my-2" />

        <div>
          <Skeleton className="h-6 w-24 mb-4" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-16" />
          </div>
        </div>

        <div>
          <Skeleton className="h-6 w-16 mb-4" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    </div>
  )
} 