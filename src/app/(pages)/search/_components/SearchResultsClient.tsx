'use client';

import Link from 'next/link';
import { MapPin, BedDouble, Bath, Users, Star, Wifi, Zap, ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { SearchProperty } from '../page';

interface Props {
  properties: SearchProperty[];
  total: number;
  current_page: number;
  last_page: number;
  params: Record<string, string>;
}

function getRatingInfo(raw: string | null): { score: string; label: string; color: string } | null {
  if (!raw) return null;
  const r = parseFloat(raw);
  if (r >= 4.8) return { score: r.toFixed(1), label: 'Exceptional', color: 'bg-emerald-600' };
  if (r >= 4.5) return { score: r.toFixed(1), label: 'Superb', color: 'bg-emerald-500' };
  if (r >= 4.2) return { score: r.toFixed(1), label: 'Fabulous', color: 'bg-[#0d1637]' };
  if (r >= 4.0) return { score: r.toFixed(1), label: 'Very Good', color: 'bg-[#0d1637]' };
  if (r >= 3.5) return { score: r.toFixed(1), label: 'Good', color: 'bg-[#0d1637]' };
  return { score: r.toFixed(1), label: 'Reviewed', color: 'bg-gray-500' };
}

function getDisplayName(p: SearchProperty): string {
  if (!p.name.includes(' ') && /^[a-z0-9]+$/i.test(p.name) && p.name.length < 20) {
    const type = p.property_type.charAt(0).toUpperCase() + p.property_type.slice(1);
    return `${type} in ${p.city}`;
  }
  return p.name;
}

function buildPageUrl(params: Record<string, string>, page: number): string {
  const p = new URLSearchParams(params);
  p.set('page', String(page));
  return `/search?${p.toString()}`;
}

function SearchCard({ p, params }: { p: SearchProperty; params: Record<string, string> }) {
  const name = getDisplayName(p);
  const location = [p.city, p.state, p.country].filter(Boolean).join(', ');
  const ratingInfo = getRatingInfo(p.rating_average);
  const price = p.display_price && p.display_price > 0
    ? p.display_price
    : p.price_from ? parseFloat(p.price_from) : null;

  const nights = (() => {
    if (!params.checkIn || !params.checkOut) return 0;
    const diff = new Date(params.checkOut).getTime() - new Date(params.checkIn).getTime();
    return Math.max(0, Math.round(diff / (1000 * 60 * 60 * 24)));
  })();

  const totalPrice = price && nights > 0 ? price * nights : null;
  const shownAmenities = (p.amenities ?? []).slice(0, 3);

  return (
    <Link href={`/property-listing/${p.id}`} className="block group cursor-pointer">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-emerald-300 transition-all duration-200">
        <div className="flex min-h-[180px]">
          {/* Image */}
          <div className="relative w-56 md:w-72 shrink-0 overflow-hidden">
            <img
              src={p.featured_image || p.images?.[0] || 'https://picsum.photos/seed/placeholder/400/300'}
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
            {p.instant_book && (
              <Badge className="absolute top-2 right-2 bg-emerald-600 text-white hover:bg-emerald-600 text-xs flex items-center gap-1">
                <Zap className="w-3 h-3" /> Instant
              </Badge>
            )}
          </div>

          {/* Details */}
          <div className="flex-1 p-4 min-w-0">
            <h2 className="text-base font-bold text-[#0d1637] group-hover:text-emerald-600 group-hover:underline line-clamp-2 mb-1 leading-snug">
              {name}
            </h2>
            <p className="text-xs text-gray-500 flex items-center gap-1 mb-2">
              <MapPin className="w-3 h-3 shrink-0 text-emerald-600" />
              <span className="line-clamp-1">{location}</span>
            </p>

            {p.description && (
              <p className="text-xs text-gray-500 line-clamp-2 mb-3">{p.description}</p>
            )}

            {/* Specs */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-3">
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
              {p.max_guests && (
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  Up to {p.max_guests}
                </span>
              )}
            </div>

            {/* Amenities */}
            {shownAmenities.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {shownAmenities.map((a, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-1 text-xs bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-full"
                  >
                    {a === 'WiFi' && <Wifi className="w-3 h-3" />}
                    {a}
                  </span>
                ))}
                {(p.amenities ?? []).length > 3 && (
                  <span className="text-xs text-gray-400">+{(p.amenities ?? []).length - 3} more</span>
                )}
              </div>
            )}
          </div>

          {/* Rating + Price */}
          <div className="w-44 shrink-0 p-4 flex flex-col items-end justify-between border-l border-gray-100 bg-gray-50/40">
            {/* Rating block */}
            {ratingInfo ? (
              <div className="flex items-start gap-2 w-full justify-end">
                <div className="text-right">
                  <div className="text-xs font-semibold text-gray-700 leading-tight">{ratingInfo.label}</div>
                  {p.rating_count > 0 && (
                    <div className="text-xs text-gray-400 flex items-center gap-0.5 justify-end">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      {p.rating_count} reviews
                    </div>
                  )}
                </div>
                <div className={cn(
                  'w-10 h-10 rounded-lg rounded-tr-none text-white flex items-center justify-center font-bold text-sm shrink-0',
                  ratingInfo.color
                )}>
                  {ratingInfo.score}
                </div>
              </div>
            ) : (
              <div />
            )}

            {/* Price block */}
            <div className="text-right w-full">
              {price ? (
                <>
                  <div className="text-xl font-bold text-[#0d1637]">
                    ${price.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-400">{p.price_currency} / night</div>
                  {totalPrice && (
                    <div className="text-xs text-gray-500 mt-0.5">
                      ${totalPrice.toLocaleString()} total
                    </div>
                  )}
                </>
              ) : (
                <div className="text-xs text-gray-400 italic">Contact for price</div>
              )}
              <button className="mt-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors">
                See availability
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function SearchResultsClient({ properties, total, current_page, last_page, params }: Props) {
  if (properties.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
        <div className="text-5xl mb-4">🔍</div>
        <p className="text-[#0d1637] font-semibold text-lg">No properties found</p>
        <p className="text-gray-400 text-sm mt-1">
          Try different dates, fewer guests, or a different location
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Count */}
      <p className="text-sm text-gray-500">
        Showing <span className="font-semibold text-[#0d1637]">{properties.length}</span> of{' '}
        <span className="font-semibold text-[#0d1637]">{total}</span> properties
      </p>

      {/* Cards */}
      {properties.map((p) => (
        <SearchCard key={p.id} p={p} params={params} />
      ))}

      {/* Pagination */}
      {last_page > 1 && (
        <nav className="flex justify-center items-center mt-8 gap-2" aria-label="Pagination">
          {current_page > 1 && (
            <Link
              href={buildPageUrl(params, current_page - 1)}
              className="flex items-center gap-1 px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white hover:bg-gray-50 hover:border-emerald-300 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </Link>
          )}
          <span className="px-4 py-2 text-sm text-gray-600 bg-white border border-gray-100 rounded-lg">
            Page {current_page} of {last_page}
          </span>
          {current_page < last_page && (
            <Link
              href={buildPageUrl(params, current_page + 1)}
              className="flex items-center gap-1 px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white hover:bg-gray-50 hover:border-emerald-300 transition-colors"
            >
              Next <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </nav>
      )}
    </div>
  );
}
