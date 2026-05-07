import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Header from '@/layouts/header';
import { Bath, BedDouble, MapPin, Shield, Star, Users } from 'lucide-react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PropertyGallery from './_components/PropertyGallery';
import BookingCard from './_components/BookingCard';

const API_BASE = 'https://pickpackgo.in-sourceit.com/api';

interface PropertyDetail {
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
  description?: string;
  star_rating?: number;
  bedrooms?: number;
  bathrooms?: number;
  max_guests?: number;
  booking_count?: number;
  view_count?: number;
  seo_slug?: string;
  api_data?: {
    bedrooms?: number;
    bathrooms?: number;
    max_occupancy?: number;
  } | null;
}

async function fetchProperty(id: string): Promise<PropertyDetail | null> {
  try {
    const res = await fetch(`${API_BASE}/public/properties/${id}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return (json.data ?? null) as PropertyDetail | null;
  } catch {
    return null;
  }
}

function formatAmenity(a: string): string {
  return a
    .replace(/^(AMENITIES_|KITCHEN_DINING_|OUTDOOR_|ENTERTAINMENT_|POOL_SPA_|THEMES_|SUITABILITY_ACCESSIBILITY_|SUITABILITY_|ACCOMMODATIONS_OTHER_SERVICES_|ACCOMMODATIONS_)/, '')
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function getDisplayName(p: PropertyDetail): string {
  if (!p.name.includes(' ') && /^[a-z0-9]+$/i.test(p.name) && p.name.length < 20) {
    const type = p.property_type.charAt(0).toUpperCase() + p.property_type.slice(1);
    return `${type} in ${p.city}`;
  }
  return p.name;
}

type Params = Promise<{ id: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  const property = await fetchProperty(id);
  if (!property) return { title: 'Property Not Found | PickPackGo' };

  const name = getDisplayName(property);
  const location = [property.city, property.state, property.country].filter(Boolean).join(', ');

  return {
    title: `${name} in ${location} | PickPackGo`,
    description:
      property.description ||
      `Book ${name} — a beautiful ${property.property_type} in ${location}.`,
    openGraph: {
      title: `${name} | PickPackGo`,
      description: `Book ${name} in ${location}.${property.rating_average ? ` Rated ${property.rating_average}★.` : ''}`,
      images: property.featured_image ? [{ url: property.featured_image }] : [],
      type: 'website',
    },
  };
}

export default async function PropertyDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  const property = await fetchProperty(id);

  if (!property) notFound();

  const name = getDisplayName(property);
  const location = [property.city, property.state, property.country].filter(Boolean).join(', ');
  const rating = property.rating_average ? parseFloat(property.rating_average) : null;

  // Deduplicate: featured_image may already be in images[]
  const allImages = [
    ...(property.featured_image ? [property.featured_image] : []),
    ...(property.images ?? []),
  ].filter((img, i, arr) => arr.indexOf(img) === i);

  const amenities = (property.amenities ?? [])
    .filter((a) => !a.startsWith('SUITABILITY'))
    .map(formatAmenity);

  const price =
    property.display_price > 0
      ? property.display_price
      : property.price_from
        ? parseFloat(property.price_from)
        : null;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <PropertyGallery images={allImages} name={name} />

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: property info */}
            <div className="lg:col-span-2 space-y-8">
              {/* Title + meta */}
              <div>
                <Badge className="mb-2 capitalize bg-gray-100 text-gray-700 hover:bg-gray-100">
                  {property.property_type}
                </Badge>
                {property.is_featured && (
                  <Badge className="mb-2 ml-2 bg-amber-500 text-white hover:bg-amber-500">
                    ★ Featured
                  </Badge>
                )}
                <h1 className="text-2xl md:text-3xl font-bold text-[#0d1637] mb-3">{name}</h1>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  {rating !== null && (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-gray-900">{rating.toFixed(1)}</span>
                      {property.rating_count > 0 && (
                        <span>({property.rating_count} reviews)</span>
                      )}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 shrink-0" />
                    <span>{location}</span>
                  </div>
                </div>

                {(property.bedrooms || property.bathrooms || property.max_guests) && (
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mt-3">
                    {property.bedrooms && (
                      <span className="flex items-center gap-1">
                        <BedDouble className="w-4 h-4" />
                        {property.bedrooms} bedroom{property.bedrooms !== 1 ? 's' : ''}
                      </span>
                    )}
                    {property.bathrooms && (
                      <span className="flex items-center gap-1">
                        <Bath className="w-4 h-4" />
                        {property.bathrooms} bathroom{property.bathrooms !== 1 ? 's' : ''}
                      </span>
                    )}
                    {property.max_guests && (
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        Up to {property.max_guests} guests
                      </span>
                    )}
                  </div>
                )}
              </div>

              <Separator />

              {/* Description */}
              {property.description && (
                <>
                  <div>
                    <h2 className="text-xl font-bold text-[#0d1637] mb-3">About this place</h2>
                    <p className="text-gray-600 leading-relaxed">{property.description}</p>
                  </div>
                  <Separator />
                </>
              )}

              {/* Amenities */}
              {amenities.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-[#0d1637] mb-4">What this place offers</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {amenities.map((amenity, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                        <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: booking card */}
            <div className="lg:col-span-1">
              <BookingCard
                price={price}
                currency={property.price_currency}
                rating={rating}
                ratingCount={property.rating_count}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
