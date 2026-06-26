import {
  Baby,
  Bath,
  BedDouble,
  Bike,
  CalendarCheck,
  Car,
  CheckCircle,
  Clock,
  Dog,
  Dumbbell,
  ExternalLink,
  Eye,
  Home,
  Leaf,
  MapPin,
  Shield,
  Shirt,
  Star,
  Tv,
  Users,
  UtensilsCrossed,
  Waves,
  Wifi,
  Wind,
  XCircle,
  Zap,
} from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import WishlistButton from "@/components/wishlist-button";
import Header from "@/layouts/header";
import BookingCard from "./_components/BookingCard";
import PropertyGallery from "./_components/PropertyGallery";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE!;

interface SeoData {
  title?: string;
  description?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  canonical?: string | null;
  no_index?: boolean;
  schema?: Record<string, unknown>;
}

interface PropertyDetail {
  id: number;
  name: string;
  property_type: string;
  category?: string | null;
  city: string;
  state?: string;
  country: string;
  country_code?: string;
  address?: string;
  postal_code?: string | null;
  latitude?: string;
  longitude?: string;
  featured_image: string;
  images?: string[];
  amenities?: string[];
  display_price?: number;
  price_from: string | null;
  price_currency: string;
  rating_average: string | null;
  rating_count: number;
  rating_breakdown?: Record<string, number> | null;
  is_featured: boolean;
  instant_book?: boolean;
  provider: string;
  description?: string;
  star_rating?: number;
  bedrooms?: number | null;
  bathrooms?: number | null;
  max_guests?: number | null;
  total_rooms?: number | null;
  booking_count?: number;
  view_count?: number;
  check_in_time?: string | null;
  check_out_time?: string | null;
  cancellation_policy?: string | null;
  child_policy?: string | null;
  pet_policy?: string | null;
  seo_slug?: string;
  seo?: { source?: string; slug?: string; data?: SeoData };
  api_data?: {
    bedrooms?: number;
    bathrooms?: number;
    max_occupancy?: number;
  } | null;
}

async function fetchProperty(slugOrId: string): Promise<PropertyDetail | null> {
  try {
    // Pure numeric ID — fetch directly
    if (/^\d+$/.test(slugOrId)) {
      const res = await fetch(`${API_BASE}/public/properties/${slugOrId}`, {
        next: { revalidate: 60 },
      });
      if (!res.ok) return null;
      const json = await res.json();
      return (json.data ?? null) as PropertyDetail | null;
    }

    // Slug — look up numeric ID via seo_slug query param, then fetch detail
    const slugRes = await fetch(
      `${API_BASE}/public/properties?seo_slug=${encodeURIComponent(slugOrId)}&per_page=1`,
      { next: { revalidate: 60 } },
    );
    if (!slugRes.ok) return null;
    const slugJson = await slugRes.json();
    const items: { id: number }[] = slugJson.data?.data ?? [];
    if (items.length === 0) return null;

    const res = await fetch(`${API_BASE}/public/properties/${items[0].id}`, {
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
    .replace(
      /^(AMENITIES_|KITCHEN_DINING_|OUTDOOR_|ENTERTAINMENT_|POOL_SPA_|THEMES_|SUITABILITY_ACCESSIBILITY_|SUITABILITY_|ACCOMMODATIONS_OTHER_SERVICES_|ACCOMMODATIONS_)/,
      "",
    )
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function getDisplayName(p: PropertyDetail): string {
  if (
    !p.name.includes(" ") &&
    /^[a-z0-9]+$/i.test(p.name) &&
    p.name.length < 20
  ) {
    const type =
      p.property_type.charAt(0).toUpperCase() + p.property_type.slice(1);
    return `${type} in ${p.city}`;
  }
  return p.name;
}

const AMENITY_ICON: Record<string, React.ReactNode> = {
  WiFi: <Wifi className="w-4 h-4" />,
  "Air Conditioning": <Wind className="w-4 h-4" />,
  Kitchen: <UtensilsCrossed className="w-4 h-4" />,
  Washer: <Shirt className="w-4 h-4" />,
  Dryer: <Shirt className="w-4 h-4" />,
  Garden: <Leaf className="w-4 h-4" />,
  "Bike Storage": <Bike className="w-4 h-4" />,
  TV: <Tv className="w-4 h-4" />,
  Pool: <Waves className="w-4 h-4" />,
  Parking: <Car className="w-4 h-4" />,
  Gym: <Dumbbell className="w-4 h-4" />,
};

function StarRating({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < value ? "fill-amber-400 text-amber-400" : "text-gray-200 fill-gray-200"}`}
        />
      ))}
    </div>
  );
}

type Params = Promise<{ id: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { id } = await params;
  const property = await fetchProperty(id);
  if (!property) return { title: "Property Not Found | PickPackGo" };

  const seo = property.seo?.data;
  const name = getDisplayName(property);
  const location = [property.city, property.state, property.country]
    .filter(Boolean)
    .join(", ");

  return {
    title: seo?.title || `${name} in ${location} | PickPackGo`,
    description:
      seo?.description ||
      property.description ||
      `Book ${name} — a beautiful ${property.property_type} in ${location}.`,
    ...(seo?.no_index && { robots: { index: false, follow: false } }),
    ...(seo?.canonical && { alternates: { canonical: seo.canonical } }),
    openGraph: {
      title: seo?.og_title || `${name} | PickPackGo`,
      description:
        seo?.og_description ||
        `Book ${name} in ${location}.${property.rating_average ? ` Rated ${property.rating_average}★.` : ""}`,
      images:
        seo?.og_image || property.featured_image
          ? [{ url: seo?.og_image || property.featured_image }]
          : [],
      type: "website",
    },
  };
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;
  const property = await fetchProperty(id);
  if (!property) notFound();

  const name = getDisplayName(property);
  const location = [property.city, property.state, property.country]
    .filter(Boolean)
    .join(", ");
  const rating = property.rating_average
    ? parseFloat(property.rating_average)
    : null;

  const bedrooms = property.bedrooms ?? property.api_data?.bedrooms ?? null;
  const bathrooms = property.bathrooms ?? property.api_data?.bathrooms ?? null;
  const maxGuests =
    property.max_guests ?? property.api_data?.max_occupancy ?? null;

  const allImages = [
    ...(property.featured_image ? [property.featured_image] : []),
    ...(property.images ?? []),
  ].filter((img, i, arr) => arr.indexOf(img) === i);

  const amenities = (property.amenities ?? [])
    .filter((a) => !a.startsWith("SUITABILITY"))
    .map(formatAmenity);

  const price =
    (property.display_price ?? 0) > 0
      ? property.display_price!
      : property.price_from
        ? parseFloat(property.price_from)
        : null;

  const seoSchema = property.seo?.data?.schema;
  const mapsLink =
    property.latitude && property.longitude
      ? `https://www.google.com/maps?q=${property.latitude},${property.longitude}`
      : null;

  return (
    <>
      {/* JSON-LD Structured Data */}
      {seoSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(seoSchema) }}
        />
      )}

      <Header />
      <div className="min-h-screen bg-gray-50">
        <PropertyGallery images={allImages} name={name} />

        {/* Stats bar */}
        <div className="bg-white border-b border-gray-100">
          <div className="container mx-auto px-4 py-3 flex flex-wrap gap-4 text-sm text-gray-500">
            {property.view_count != null && (
              <span className="flex items-center gap-1.5">
                <Eye className="w-4 h-4" />{" "}
                {property.view_count.toLocaleString()} views
              </span>
            )}
            {property.booking_count != null && (
              <span className="flex items-center gap-1.5">
                <CalendarCheck className="w-4 h-4" />{" "}
                {property.booking_count.toLocaleString()} bookings
              </span>
            )}
            {property.instant_book && (
              <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
                <Zap className="w-4 h-4 fill-emerald-600" /> Instant Book
              </span>
            )}
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ───── Left Column ───── */}
            <div className="lg:col-span-2 space-y-8">
              {/* Title & Meta */}
              <div>
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge className="capitalize bg-gray-100 text-gray-700 hover:bg-gray-100">
                    {property.property_type}
                  </Badge>
                  {property.is_featured && (
                    <Badge className="bg-amber-500 text-white hover:bg-amber-500">
                      ★ Featured
                    </Badge>
                  )}
                  {property.instant_book && (
                    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 flex items-center gap-1">
                      <Zap className="w-3 h-3" /> Instant Book
                    </Badge>
                  )}
                </div>

                <div className="flex items-start justify-between gap-4 mb-3">
                  <h1 className="text-2xl md:text-3xl font-bold text-[#0d1637]">
                    {name}
                  </h1>
                  <WishlistButton
                    propertyCode={property.seo_slug ?? String(property.id)}
                    propertyName={name}
                    propertyType={property.property_type}
                    pricePerNight={price ?? undefined}
                    currency={property.price_currency}
                    imageUrl={property.featured_image}
                    seoSlug={property.seo_slug}
                    size="md"
                    className="shrink-0 mt-1"
                  />
                </div>

                {/* Star rating */}
                {property.star_rating != null && (
                  <div className="flex items-center gap-2 mb-3">
                    <StarRating value={property.star_rating} />
                    <span className="text-sm text-gray-500">
                      {property.star_rating}-star property
                    </span>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  {rating !== null && (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-gray-900">
                        {rating.toFixed(1)}
                      </span>
                      {property.rating_count > 0 && (
                        <span>
                          ({property.rating_count.toLocaleString()} reviews)
                        </span>
                      )}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 shrink-0" />
                    <span>{location}</span>
                  </div>
                </div>
              </div>

              {/* Quick Facts */}
              {(bedrooms != null ||
                bathrooms != null ||
                maxGuests != null ||
                property.total_rooms != null) && (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {bedrooms != null && (
                      <div className="bg-white rounded-xl border border-gray-100 p-4 text-center shadow-sm">
                        <BedDouble className="w-6 h-6 text-[#0d1637] mx-auto mb-2" />
                        <p className="text-xl font-bold text-[#0d1637]">
                          {bedrooms}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Bedroom{bedrooms !== 1 ? "s" : ""}
                        </p>
                      </div>
                    )}
                    {bathrooms != null && (
                      <div className="bg-white rounded-xl border border-gray-100 p-4 text-center shadow-sm">
                        <Bath className="w-6 h-6 text-[#0d1637] mx-auto mb-2" />
                        <p className="text-xl font-bold text-[#0d1637]">
                          {bathrooms}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Bathroom{bathrooms !== 1 ? "s" : ""}
                        </p>
                      </div>
                    )}
                    {maxGuests != null && (
                      <div className="bg-white rounded-xl border border-gray-100 p-4 text-center shadow-sm">
                        <Users className="w-6 h-6 text-[#0d1637] mx-auto mb-2" />
                        <p className="text-xl font-bold text-[#0d1637]">
                          {maxGuests}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Max Guests
                        </p>
                      </div>
                    )}
                    {property.total_rooms != null && (
                      <div className="bg-white rounded-xl border border-gray-100 p-4 text-center shadow-sm">
                        <Home className="w-6 h-6 text-[#0d1637] mx-auto mb-2" />
                        <p className="text-xl font-bold text-[#0d1637]">
                          {property.total_rooms}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Total Rooms
                        </p>
                      </div>
                    )}
                  </div>
                  <Separator />
                </>
              )}

              {/* Description */}
              {property.description && (
                <>
                  <div>
                    <h2 className="text-xl font-bold text-[#0d1637] mb-3">
                      About this place
                    </h2>
                    <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                      {property.description}
                    </p>
                  </div>
                  <Separator />
                </>
              )}

              {/* Amenities */}
              {amenities.length > 0 && (
                <>
                  <div>
                    <h2 className="text-xl font-bold text-[#0d1637] mb-4">
                      What this place offers
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {amenities.map((amenity, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2.5 text-sm text-gray-700"
                        >
                          <span className="text-emerald-600 shrink-0">
                            {AMENITY_ICON[amenity] ?? (
                              <Shield className="w-4 h-4" />
                            )}
                          </span>
                          <span>{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Separator />
                </>
              )}

              {/* Check-in / Check-out */}
              {(property.check_in_time || property.check_out_time) && (
                <>
                  <div>
                    <h2 className="text-xl font-bold text-[#0d1637] mb-4">
                      Check-in & Check-out
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                      {property.check_in_time && (
                        <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                          <Clock className="w-5 h-5 text-emerald-600 shrink-0" />
                          <div>
                            <p className="text-xs text-gray-500 uppercase font-semibold">
                              Check-in
                            </p>
                            <p className="font-semibold text-[#0d1637]">
                              {property.check_in_time}
                            </p>
                          </div>
                        </div>
                      )}
                      {property.check_out_time && (
                        <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                          <Clock className="w-5 h-5 text-gray-400 shrink-0" />
                          <div>
                            <p className="text-xs text-gray-500 uppercase font-semibold">
                              Check-out
                            </p>
                            <p className="font-semibold text-[#0d1637]">
                              {property.check_out_time}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <Separator />
                </>
              )}

              {/* Policies */}
              {(property.cancellation_policy ||
                property.child_policy ||
                property.pet_policy) && (
                <>
                  <div>
                    <h2 className="text-xl font-bold text-[#0d1637] mb-4">
                      House Rules & Policies
                    </h2>
                    <div className="space-y-4">
                      {property.cancellation_policy && (
                        <div className="flex gap-3 p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                          <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-[#0d1637] text-sm mb-0.5">
                              Cancellation Policy
                            </p>
                            <p className="text-gray-600 text-sm">
                              {property.cancellation_policy}
                            </p>
                          </div>
                        </div>
                      )}
                      {property.child_policy && (
                        <div className="flex gap-3 p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                          <Baby className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-[#0d1637] text-sm mb-0.5">
                              Children Policy
                            </p>
                            <p className="text-gray-600 text-sm">
                              {property.child_policy}
                            </p>
                          </div>
                        </div>
                      )}
                      {property.pet_policy && (
                        <div className="flex gap-3 p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                          <Dog className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-[#0d1637] text-sm mb-0.5">
                              Pet Policy
                            </p>
                            <p className="text-gray-600 text-sm">
                              {property.pet_policy}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <Separator />
                </>
              )}

              {/* Location */}
              <div>
                <h2 className="text-xl font-bold text-[#0d1637] mb-4">
                  Location
                </h2>
                <div className="space-y-3">
                  {property.address && (
                    <div className="flex items-start gap-2 text-gray-600 text-sm">
                      <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                      <span>
                        {[
                          property.address,
                          property.city,
                          property.state,
                          property.postal_code,
                          property.country,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </span>
                    </div>
                  )}
                  {mapsLink && (
                    <a
                      href={mapsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View on Google Maps
                    </a>
                  )}
                  {property.latitude && property.longitude && (
                    <div className="mt-3 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                      <iframe
                        title="Property location"
                        src={`https://www.openstreetmap.org/export/embed.html?bbox=${parseFloat(property.longitude) - 0.012},${parseFloat(property.latitude) - 0.008},${parseFloat(property.longitude) + 0.012},${parseFloat(property.latitude) + 0.008}&layer=mapnik&marker=${property.latitude},${property.longitude}`}
                        width="100%"
                        height="300"
                        style={{ border: 0 }}
                        loading="lazy"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                  <Shield className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-emerald-900">
                      Secure Booking
                    </p>
                    <p className="text-xs text-emerald-700">
                      Bank-level encryption
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
                  <CheckCircle className="w-5 h-5 text-blue-600 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-blue-900">
                      Verified Property
                    </p>
                    <p className="text-xs text-blue-700">Identity confirmed</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl border border-amber-100">
                  <Star className="w-5 h-5 fill-amber-500 text-amber-500 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-amber-900">
                      Top Rated
                    </p>
                    <p className="text-xs text-amber-700">
                      {rating != null
                        ? `${rating.toFixed(1)} · ${property.rating_count} reviews`
                        : "Guest favourite"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ───── Right Column: Booking Card ───── */}
            <div className="lg:col-span-1">
              <BookingCard
                propertyId={property.id}
                price={price ?? null}
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
