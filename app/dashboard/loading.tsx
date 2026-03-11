export default function DashboardLoading() {
  return (
    <div className="w-full h-full p-4 md:p-8 flex flex-col space-y-8 animate-pulse relative overflow-hidden">
      
      {/* 🟢 Subtle Background Glow to match your theme */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FF6B4A] rounded-full blur-[150px] opacity-5 pointer-events-none"></div>

      {/* Header Skeleton */}
      <div className="flex justify-between items-end border-b border-[#252733] pb-6">
        <div className="space-y-3">
          <div className="h-9 w-48 bg-[#1C1E28] rounded-xl border border-[#252733]"></div>
          <div className="h-4 w-64 bg-[#1C1E28] rounded-lg opacity-50"></div>
        </div>
        <div className="hidden md:block h-10 w-32 bg-[#1C1E28] rounded-xl border border-[#252733]"></div>
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="h-32 bg-[#1C1E28] rounded-2xl border border-[#252733] shadow-lg"></div>
        <div className="h-32 bg-[#1C1E28] rounded-2xl border border-[#252733] shadow-lg"></div>
        <div className="h-32 bg-[#1C1E28] rounded-2xl border border-[#252733] shadow-lg"></div>
      </div>

      {/* Main Content Area Skeleton */}
      <div className="flex-1 space-y-4 mt-4">
        <div className="h-12 w-full max-w-sm bg-[#1C1E28] rounded-xl border border-[#252733]"></div>
        <div className="h-[400px] bg-[#1C1E28] rounded-3xl border border-[#252733] w-full shadow-2xl relative flex items-center justify-center">
            {/* Minimalist Loading Spinner in the center */}
            <div className="flex flex-col items-center gap-3">
                <div className="w-6 h-6 border-2 border-[#FF6B4A]/20 border-t-[#FF6B4A] rounded-full animate-spin"></div>
                <span className="text-[10px] font-black text-[#737490] tracking-widest uppercase">Fetching Data...</span>
            </div>
        </div>
      </div>
      
    </div>
  )
}