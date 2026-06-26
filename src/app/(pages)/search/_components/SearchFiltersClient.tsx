"use client";

import { Loader2, SlidersHorizontal } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface Props {
  initialParams: Record<string, string>;
}

const inputClass =
  "w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white transition-colors hover:border-gray-300";

const triggerClass =
  "w-full border-gray-200 text-sm hover:border-gray-300 focus:ring-emerald-500";

export default function SearchFiltersClient({ initialParams }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const [propertyType, setPropertyType] = useState(
    initialParams.propertyType ?? "",
  );
  const [minPrice, setMinPrice] = useState(initialParams.minPrice ?? "");
  const [maxPrice, setMaxPrice] = useState(initialParams.maxPrice ?? "");
  const [bedrooms, setBedrooms] = useState(initialParams.bedrooms ?? "");
  const [bathrooms, setBathrooms] = useState(initialParams.bathrooms ?? "");
  const [sort, setSort] = useState(initialParams.sort ?? "");
  const [isLoading, setIsLoading] = useState(false);

  const applyFilters = useCallback(() => {
    setIsLoading(true);
    const p = new URLSearchParams();
    // Preserve search params
    if (initialParams.location) p.set("location", initialParams.location);
    if (initialParams.checkIn) p.set("checkIn", initialParams.checkIn);
    if (initialParams.checkOut) p.set("checkOut", initialParams.checkOut);
    if (initialParams.guests) p.set("guests", initialParams.guests);
    // Apply filters
    if (propertyType) p.set("propertyType", propertyType);
    if (minPrice) p.set("minPrice", minPrice);
    if (maxPrice) p.set("maxPrice", maxPrice);
    if (bedrooms) p.set("bedrooms", bedrooms);
    if (bathrooms) p.set("bathrooms", bathrooms);
    if (sort) p.set("sort", sort);
    router.push(`${pathname}?${p.toString()}`);
  }, [
    propertyType,
    minPrice,
    maxPrice,
    bedrooms,
    bathrooms,
    sort,
    initialParams,
    pathname,
    router,
  ]);

  const clearFilters = useCallback(() => {
    setPropertyType("");
    setMinPrice("");
    setMaxPrice("");
    setBedrooms("");
    setBathrooms("");
    setSort("");
    const p = new URLSearchParams();
    if (initialParams.location) p.set("location", initialParams.location);
    if (initialParams.checkIn) p.set("checkIn", initialParams.checkIn);
    if (initialParams.checkOut) p.set("checkOut", initialParams.checkOut);
    if (initialParams.guests) p.set("guests", initialParams.guests);
    router.push(`${pathname}?${p.toString()}`);
  }, [initialParams, pathname, router]);

  const hasActiveFilters = !!(
    propertyType ||
    minPrice ||
    maxPrice ||
    bedrooms ||
    bathrooms ||
    sort
  );

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 bg-[#0d1637]">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
          <h3 className="font-semibold text-sm text-white">Filters</h3>
          {hasActiveFilters && (
            <span className="bg-emerald-500 text-white text-xs font-medium px-1.5 py-0.5 rounded-full leading-none">
              Active
            </span>
          )}
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-medium"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="p-5 space-y-5">
        {/* Sort */}
        <div>
          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-1.5">
            Sort By
          </label>
          <Select
            value={sort || "__featured"}
            onValueChange={(v) => setSort(v === "__featured" ? "" : v)}
          >
            <SelectTrigger className={triggerClass}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__featured">Featured</SelectItem>
              <SelectItem value="price_asc">Price: Low → High</SelectItem>
              <SelectItem value="price_desc">Price: High → Low</SelectItem>
              <SelectItem value="rating_desc">Highest Rated</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Property Type */}
        <div>
          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-1.5">
            Property Type
          </label>
          <Select
            value={propertyType || "__all"}
            onValueChange={(v) => setPropertyType(v === "__all" ? "" : v)}
          >
            <SelectTrigger className={triggerClass}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all">All Types</SelectItem>
              <SelectItem value="villa">Villa</SelectItem>
              <SelectItem value="house">House</SelectItem>
              <SelectItem value="apartment">Apartment</SelectItem>
              <SelectItem value="cabin">Cabin</SelectItem>
              <SelectItem value="cottage">Cottage</SelectItem>
              <SelectItem value="condo">Condo</SelectItem>
              <SelectItem value="bungalow">Bungalow</SelectItem>
              <SelectItem value="loft">Loft</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Price Range */}
        <div>
          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-2">
            Price Range{" "}
            <span className="text-gray-400 font-normal normal-case">
              (per night)
            </span>
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="Min $"
              min={0}
              className={cn(inputClass, "flex-1 w-0")}
            />
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="Max $"
              min={0}
              className={cn(inputClass, "flex-1 w-0")}
            />
          </div>
        </div>

        <Separator />

        {/* Bedrooms */}
        <div>
          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-1.5">
            Min Bedrooms
          </label>
          <Select
            value={bedrooms || "__any"}
            onValueChange={(v) => setBedrooms(v === "__any" ? "" : v)}
          >
            <SelectTrigger className={triggerClass}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__any">Any</SelectItem>
              <SelectItem value="1">1+</SelectItem>
              <SelectItem value="2">2+</SelectItem>
              <SelectItem value="3">3+</SelectItem>
              <SelectItem value="4">4+</SelectItem>
              <SelectItem value="5">5+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bathrooms */}
        <div>
          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-1.5">
            Min Bathrooms
          </label>
          <Select
            value={bathrooms || "__any"}
            onValueChange={(v) => setBathrooms(v === "__any" ? "" : v)}
          >
            <SelectTrigger className={triggerClass}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__any">Any</SelectItem>
              <SelectItem value="1">1+</SelectItem>
              <SelectItem value="2">2+</SelectItem>
              <SelectItem value="3">3+</SelectItem>
              <SelectItem value="4">4+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Action buttons */}
        <div className="space-y-2 pt-1">
          <Button
            onClick={applyFilters}
            disabled={isLoading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold disabled:opacity-80"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              "Apply Filters"
            )}
          </Button>
          {hasActiveFilters && (
            <Button
              onClick={clearFilters}
              variant="outline"
              className="w-full text-[#0d1637] border-[#0d1637] hover:bg-[#0d1637] hover:text-white"
            >
              Clear All Filters
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
