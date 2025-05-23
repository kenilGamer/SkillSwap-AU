export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      <span className="ml-4 text-xl font-bold text-blue-600">Loading...</span>
    </div>
  );
} 