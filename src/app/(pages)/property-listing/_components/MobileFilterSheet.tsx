'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { SlidersHorizontal } from 'lucide-react';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import PropertyFiltersClient from './PropertyFiltersClient';

interface Props {
  initialParams: Record<string, string>;
  hasFilters: boolean;
  activeFilterCount: number;
}

export default function MobileFilterSheet({ initialParams, hasFilters, activeFilterCount }: Props) {
  const [open, setOpen] = useState(false);
  const searchParams = useSearchParams();

  // Auto-close when filters are applied (searchParams change)
  useEffect(() => {
    setOpen(false);
  }, [searchParams]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white hover:bg-gray-50"
      >
        <SlidersHorizontal className="w-4 h-4" />
        Filters
        {hasFilters && (
          <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center">
            {activeFilterCount}
          </span>
        )}
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="bottom"
          className="h-[85vh] p-0 rounded-t-2xl overflow-hidden"
        >
          <SheetTitle className="sr-only">Filters</SheetTitle>
          <div className="h-full overflow-y-auto">
            <PropertyFiltersClient
              key={JSON.stringify(initialParams)}
              initialParams={initialParams}
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
