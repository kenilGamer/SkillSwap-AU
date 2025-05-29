
export default function RootLoading() {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50">
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="h-8 w-8 rounded-full bg-indigo-500"></div>
            </div>
          </div>
          <p className="text-indigo-600 font-medium">Loading...</p>
        </div>
      </div>
    </div>
  )
} 