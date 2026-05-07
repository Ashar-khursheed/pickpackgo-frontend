'use client';

import { useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface Props {
  initialParams: Record<string, string>;
}

export default function PropertyFiltersClient({ initialParams }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const [location, setLocation] = useState(initialParams.location ?? '');
  const [city, setCity] = useState(initialParams.city ?? '');
  const [propertyType, setPropertyType] = useState(initialParams.property_type ?? '');
  const [minPrice, setMinPrice] = useState(initialParams.min_price ?? '');
  const [maxPrice, setMaxPrice] = useState(initialParams.max_price ?? '');
  const [bedrooms, setBedrooms] = useState(initialParams.bedrooms ?? '');

  const applyFilters = useCallback(() => {
    const p = new URLSearchParams();
    if (location) p.set('location', location);
    if (city) p.set('city', city);
    if (propertyType) p.set('property_type', propertyType);
    if (minPrice) p.set('min_price', minPrice);
    if (maxPrice) p.set('max_price', maxPrice);
    if (bedrooms) p.set('bedrooms', bedrooms);
    if (initialParams.sort_by) p.set('sort_by', initialParams.sort_by);
    if (initialParams.min_rating) p.set('min_rating', initialParams.min_rating);
    router.push(`${pathname}?${p.toString()}`);
  }, [location, city, propertyType, minPrice, maxPrice, bedrooms, initialParams, pathname, router]);

  const clearFilters = useCallback(() => {
    setLocation('');
    setCity('');
    setPropertyType('');
    setMinPrice('');
    setMaxPrice('');
    setBedrooms('');
    const p = new URLSearchParams();
    if (initialParams.sort_by) p.set('sort_by', initialParams.sort_by);
    if (initialParams.min_rating) p.set('min_rating', initialParams.min_rating);
    router.push(`${pathname}${p.toString() ? `?${p.toString()}` : ''}`);
  }, [initialParams, pathname, router]);

  const hasActiveFilters = !!(location || city || propertyType || minPrice || maxPrice || bedrooms);

  const inputClass =
    'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white transition-colors hover:border-gray-300';

  const triggerClass = 'w-full border-gray-200 text-sm hover:border-gray-300 focus:ring-emerald-500';

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
        {/* Search Name */}
        <div>
          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-1.5">
            Search name
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
            placeholder="e.g. Beachfront, Downtown"
            className={inputClass}
          />
        </div>

        {/* City */}
        <div>
          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-1.5">
            City
          </label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
            placeholder="e.g. New York"
            className={inputClass}
          />
        </div>

        <Separator />

        {/* Property Type */}
        <div>
          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-1.5">
            Property Type
          </label>
          <Select
            value={propertyType || '__all'}
            onValueChange={(v) => setPropertyType(v === '__all' ? '' : v)}
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
              <SelectItem value="barn">Barn</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Price Range */}
        <div>
          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-2">
            Price Range{' '}
            <span className="text-gray-400 font-normal normal-case">(per night)</span>
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="Min $"
              min={0}
              className={cn(inputClass, 'flex-1 w-0')}
            />
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="Max $"
              min={0}
              className={cn(inputClass, 'flex-1 w-0')}
            />
          </div>
        </div>

        <Separator />

        {/* Min Bedrooms */}
        <div>
          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-1.5">
            Min Bedrooms
          </label>
          <Select
            value={bedrooms || '__any'}
            onValueChange={(v) => setBedrooms(v === '__any' ? '' : v)}
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

        {/* Action buttons */}
        <div className="space-y-2 pt-1">
          <Button
            onClick={applyFilters}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
          >
            Apply Filters
          </Button>
          {hasActiveFilters && (
            <Button onClick={clearFilters} variant="outline" className="w-full text-[#0d1637] border-[#0d1637] hover:bg-[#0d1637] hover:text-white">
              Clear All Filters
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
