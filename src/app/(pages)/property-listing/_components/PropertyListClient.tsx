'use client';

import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Bath, BedDouble, LayoutGrid, LayoutList, MapPin, Star } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

interface Property {
  id: number;
  name: string;
  property_type: string;
  city: string;
  state?: string;
  country: string;
  featured_image: string;
  images?: string[];
  amenities?: string[];
  display_price: number;
  price_from: string | null;
  price_currency: string;
  rating_average: string | null;
  rating_count: number;
  is_featured: boolean;
  provider: string;
  booking_count?: number;
  view_count?: number;
  star_rating?: number;
  bedrooms?: number;
  bathrooms?: number;
  max_guests?: number;
  seo_slug?: string;
  api_data?: { bedrooms?: number; bathrooms?: number; max_occupancy?: number } | null;
}

interface Props {
  properties: Property[];
  total: number;
  initialParams: Record<string, string>;
}

function formatAmenity(a: string): string {
  return a
    .replace(
      /^(AMENITIES_|KITCHEN_DINING_|OUTDOOR_|ENTERTAINMENT_|POOL_SPA_|THEMES_|SUITABILITY_ACCESSIBILITY_|SUITABILITY_|ACCOMMODATIONS_OTHER_SERVICES_|ACCOMMODATIONS_)/,
      ''
    )
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function getDisplayName(p: Property): string {
  if (!p.name.includes(' ') && /^[a-z0-9]+$/i.test(p.name) && p.name.length < 20) {
    const type = p.property_type.charAt(0).toUpperCase() + p.property_type.slice(1);
    return `${type} in ${p.city}`;
  }
  return p.name;
}

function getRatingInfo(raw: string | null): { score: string; label: string; color: string } | null {
  if (!raw) return null;
  const r = parseFloat(raw) * 2;
  if (r >= 9.5) return { score: r.toFixed(1), label: 'Exceptional', color: 'bg-emerald-600' };
  if (r >= 9.0) return { score: r.toFixed(1), label: 'Superb', color: 'bg-emerald-500' };
  if (r >= 8.5) return { score: r.toFixed(1), label: 'Fabulous', color: 'bg-[#0d1637]' };
  if (r >= 8.0) return { score: r.toFixed(1), label: 'Very Good', color: 'bg-[#0d1637]' };
  if (r >= 7.0) return { score: r.toFixed(1), label: 'Good', color: 'bg-[#0d1637]' };
  return { score: r.toFixed(1), label: 'Reviewed', color: 'bg-gray-500' };
}

function PriceBlock({ p, size = 'lg' }: { p: Property; size?: 'lg' | 'sm' }) {
  const big = size === 'lg' ? 'text-2xl' : 'text-xl';
  if (p.display_price > 0) {
    return (
      <div className="text-right">
        <div className={cn(big, 'font-bold text-gray-900')}>${p.display_price.toLocaleString()}</div>
        <div className="text-xs text-gray-500">{p.price_currency} / night</div>
      </div>
    );
  }
  if (p.price_from) {
    return (
      <div className="text-right">
        <div className="text-xs text-gray-400">from</div>
        <div className={cn(big, 'font-bold text-gray-900')}>
          ${parseFloat(p.price_from).toLocaleString()}
        </div>
        <div className="text-xs text-gray-500">per night</div>
      </div>
    );
  }
  return <div className="text-xs text-gray-400 italic">Contact for pricing</div>;
}

// ── List Card ──────────────────────────────────────────────────────────────

function ListCard({ p }: { p: Property }) {
  const name = getDisplayName(p);
  const location = [p.city, p.state, p.country]?.filter(Boolean)?.join(', ');
  const ratingInfo = getRatingInfo(p.rating_average);
  const amenities = (p?.amenities ?? [])
    .filter((a) => !a.startsWith('SUITABILITY'))
    .slice(0, 4)
    .map(formatAmenity);

  return (
    <Link href={`/property-listing/${p.id}`} className="block group cursor-pointer">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-emerald-300 transition-all duration-200">
        <div className="flex min-h-[160px]">
          {/* Image */}
          <div className="relative w-52 md:w-64 shrink-0 overflow-hidden">
            <img
              src={
                p.featured_image ||
                p.images?.[0] ||
                'https://picsum.photos/seed/placeholder/400/300'
              }
              alt={name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <Badge className="absolute top-2 left-2 bg-black/70 text-white capitalize hover:bg-black/70 text-xs font-normal">
              {p.property_type}
            </Badge>
            {p.is_featured && (
              <Badge className="absolute bottom-2 left-2 bg-amber-500 text-white hover:bg-amber-500 text-xs">
                ★ Featured
              </Badge>
            )}
          </div>

          {/* Details */}
          <div className="flex-1 p-4 min-w-0">
            <h2 className="text-base font-bold text-[#0d1637] group-hover:text-[#0d1637] group-hover:underline line-clamp-2 mb-1 leading-snug">
              {name}
            </h2>
            <p className="text-xs text-gray-500 flex items-center gap-1 mb-3">
              <MapPin className="w-3 h-3 shrink-0 text-emerald-600" />
              <span className="line-clamp-1">{location}</span>
            </p>

            {(p.bedrooms || p.bathrooms) && (
              <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                {p.bedrooms && (
                  <span className="flex items-center gap-1">
                    <BedDouble className="w-3.5 h-3.5" />
                    {p.bedrooms} bed{p.bedrooms !== 1 ? 's' : ''}
                  </span>
                )}
                {p.bathrooms && (
                  <span className="flex items-center gap-1">
                    <Bath className="w-3.5 h-3.5" />
                    {p.bathrooms} bath{p.bathrooms !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
            )}

            {amenities.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {amenities.map((a, i) => (
                  <span
                    key={i}
                    className="text-xs bg-gray-50 border border-gray-200 text-gray-600 px-2 py-0.5 rounded-full"
                  >
                    {a}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Rating + Price */}
          <div className="w-48 shrink-0 p-4 flex flex-col items-end justify-between border-l border-gray-100 bg-gray-50/40">
            {ratingInfo ? (
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <div className="text-xs font-semibold text-gray-700">{ratingInfo.label}</div>
                  {p.booking_count != null && p.booking_count > 0 && (
                    <div className="text-xs text-gray-400">{p.booking_count} Total Booking</div>
                  )}
                </div>
                <div
                  className={cn(
                    'w-10 h-10 bg-[#0d1637] rounded-lg rounded-tr-none text-white flex items-center justify-center font-bold text-sm shrink-0',
                 
                  )}
                >
                {p?.rating_average != null ? Number(p.rating_average).toFixed(1) : ''}
                </div>
              </div>
            ) : (
              <div />
            )}

            <div className="text-right">
              <PriceBlock p={p} size="lg" />
              <span className="mt-2 inline-block bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer">
                See availability
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ── Grid Card ──────────────────────────────────────────────────────────────

function GridCard({ p }: { p: Property }) {
  const name = getDisplayName(p);
  const location = [p.city, p.state, p.country]?.filter(Boolean)?.join(', ');
  const ratingInfo = getRatingInfo(p.rating_average);

  return (
    <Link href={`/property-listing/${p.id}`} className="block group cursor-pointer h-full">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-emerald-300 transition-all duration-200 flex flex-col h-full">
        <div className="relative h-48 shrink-0 overflow-hidden">
          <img
            src={
              p.featured_image ||
              p.images?.[0] ||
              'https://picsum.photos/seed/placeholder/400/300'
            }
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <Badge className="absolute top-2 left-2 bg-black/70 text-white capitalize hover:bg-black/70 text-xs font-normal">
            {p.property_type}
          </Badge>
          {p.is_featured && (
            <Badge className="absolute top-2 right-2 bg-amber-500 text-white hover:bg-amber-500 text-xs">
              ★ Featured
            </Badge>
          )}
        </div>

        <div className="p-3 flex flex-col flex-1">
          <h2 className="text-sm font-bold text-[#0d1637] group-hover:text-emerald-600 group-hover:underline line-clamp-2 mb-1 leading-snug">
            {name}
          </h2>
          <p className="text-xs text-gray-500 flex items-center gap-1 mb-2">
            <MapPin className="w-3 h-3 shrink-0 text-emerald-600" />
            <span className="line-clamp-1">{location}</span>
          </p>

          {(p.bedrooms || p.bathrooms) && (
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
              {p.bedrooms && (
                <span className="flex items-center gap-0.5">
                  <BedDouble className="w-3 h-3" /> {p.bedrooms}
                </span>
              )}
              {p.bathrooms && (
                <span className="flex items-center gap-0.5">
                  <Bath className="w-3 h-3" /> {p.bathrooms}
                </span>
              )}
            </div>
          )}

          <div className="mt-auto pt-2 border-t border-gray-100 flex items-end justify-between gap-2">
            {ratingInfo ? (
              <div
                className={cn(
                  'flex items-center gap-1 px-2 py-1 rounded-lg text-white text-xs font-bold shrink-0',
                  ratingInfo.color
                )}
              >
                <Star className="w-3 h-3 fill-white" />
                {ratingInfo.score}
              </div>
            ) : (
              <div />
            )}
            <PriceBlock p={p} size="sm" />
          </div>
        </div>
      </div>
    </Link>
  );
}

// ── Main export ────────────────────────────────────────────────────────────

const toolbarTriggerClass = 'h-9 text-sm border-gray-200 hover:border-gray-300 min-w-[130px]';

export default function PropertyListClient({ properties, total, initialParams }: Props) {
  console.log('Initial params:', properties);
  const router = useRouter();
  const pathname = usePathname();

  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [sortBy, setSortBy] = useState(initialParams.sort_by ?? '');
  const [minRating, setMinRating] = useState(initialParams.min_rating ?? '');

  const navigate = useCallback((newSort: string, newRating: string) => {
    const p = new URLSearchParams(initialParams);
    p.delete('sort_by');
    p.delete('min_rating');
    p.delete('page');
    if (newSort) p.set('sort_by', newSort);
    if (newRating) p.set('min_rating', newRating);
    router.push(`${pathname}?${p.toString()}`);
  }, [initialParams, pathname, router]);

  if (properties.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
        <div className="text-5xl mb-4">🏠</div>
        <p className="text-gray-700 font-semibold text-lg">No properties found</p>
        <p className="text-gray-400 text-sm mt-1">Try adjusting or clearing your filters</p>
        <Link
          href="/property-listing"
          className="mt-4 inline-block text-sm text-emerald-600 hover:text-emerald-700 font-medium"
        >
          View all properties →
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3">
        <p className="text-sm text-gray-500">
          Showing{' '}
          <span className="font-semibold text-[#0d1637]">{properties.length}</span> of{' '}
          <span className="font-semibold text-[#0d1637]">{total}</span> properties
        </p>

        <div className="flex items-center gap-2 flex-wrap">
        <div className="flex gap-3">
          {/* Min Rating */}
          <Select
            value={minRating || '__any'}
            onValueChange={(v) => {
              const val = v === '__any' ? '' : v;
              setMinRating(val);
              navigate(sortBy, val);
            }}
          >
            <SelectTrigger className={toolbarTriggerClass}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__any">⭐ Any Rating</SelectItem>
              <SelectItem value="3">3+ Stars</SelectItem>
              <SelectItem value="3.5">3.5+ Stars</SelectItem>
              <SelectItem value="4">4+ Stars</SelectItem>
              <SelectItem value="4.5">4.5+ Stars</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort By */}
          <Select
            value={sortBy || '__default'}
            onValueChange={(v) => {
              const val = v === '__default' ? '' : v;
              setSortBy(val);
              navigate(val, minRating);
            }}
          >
            <SelectTrigger className={cn(toolbarTriggerClass, 'min-w-[160px]')}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__default">↕ Sort: Default</SelectItem>
              <SelectItem value="price_asc">Price: Low → High</SelectItem>
              <SelectItem value="price_desc">Price: High → Low</SelectItem>
              <SelectItem value="rating_desc">Highest Rated</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
          {/* Grid / List toggle */}
          <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-1 bg-gray-50">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={cn(
                'p-1.5 rounded transition-colors',
                viewMode === 'list'
                  ? 'bg-[#0d1637] text-white'
                  : 'text-gray-400 hover:text-[#0d1637]'
              )}
              title="List view"
            >
              <LayoutList className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={cn(
                'p-1.5 rounded transition-colors',
                viewMode === 'grid'
                  ? 'bg-[#0d1637] text-white'
                  : 'text-gray-400 hover:text-[#0d1637]'
              )}
              title="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Cards */}
      {viewMode === 'list' ? (
        <div className="space-y-3">
          {properties.map((p) => (
            <ListCard key={p.id} p={p} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {properties.map((p) => (
            <GridCard key={p.id} p={p} />
          ))}
        </div>
      )}
    </div>
  );
}
