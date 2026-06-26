import Header from "@/layouts/header";

function CardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
      <div className="flex min-h-[180px]">
        <div className="w-56 md:w-72 shrink-0 bg-gray-200" />
        <div className="flex-1 p-4 space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
          <div className="h-3 bg-gray-200 rounded w-full" />
          <div className="h-3 bg-gray-200 rounded w-5/6" />
          <div className="flex gap-2 mt-2">
            <div className="h-6 bg-gray-200 rounded-full w-16" />
            <div className="h-6 bg-gray-200 rounded-full w-16" />
            <div className="h-6 bg-gray-200 rounded-full w-16" />
          </div>
        </div>
        <div className="w-44 shrink-0 p-4 border-l border-gray-100 bg-gray-50/40 flex flex-col items-end justify-between">
          <div className="h-10 w-10 bg-gray-200 rounded-lg" />
          <div className="space-y-1 w-full">
            <div className="h-7 bg-gray-200 rounded w-20 ml-auto" />
            <div className="h-3 bg-gray-200 rounded w-16 ml-auto" />
            <div className="h-8 bg-gray-200 rounded w-full mt-2" />
          </div>
        </div>
      </div>
    </div>
  );
}

function SidebarSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
      <div className="h-14 bg-gray-300" />
      <div className="p-5 space-y-5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="space-y-2">
            <div className="h-3 bg-gray-200 rounded w-24" />
            <div className="h-9 bg-gray-200 rounded-lg w-full" />
          </div>
        ))}
        <div className="h-9 bg-gray-200 rounded-lg w-full mt-2" />
      </div>
    </div>
  );
}

export default function SearchLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Search bar section skeleton */}
      <div className="bg-[#0d1637] py-6">
        <div className="w-full max-w-6xl mx-auto p-4">
          <div className="bg-white rounded-2xl shadow-lg h-[120px] animate-pulse" />
        </div>
      </div>

      {/* Summary bar skeleton */}
      <div className="bg-white border-b border-gray-200">
        <div className="global-container px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-28 ml-auto animate-pulse" />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="global-container px-4 py-6">
        <div className="flex gap-6 items-start">
          {/* Sidebar */}
          <aside className="hidden lg:block w-72 shrink-0">
            <SidebarSkeleton />
          </aside>

          {/* Cards */}
          <main className="flex-1 min-w-0 space-y-4">
            <div className="h-4 bg-gray-200 rounded w-40 animate-pulse" />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </main>
        </div>
      </div>
    </div>
  );
}
