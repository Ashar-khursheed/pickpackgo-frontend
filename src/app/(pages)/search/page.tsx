import type { Metadata } from "next";
import SearchBar from "@/components/search-bar";
import Header from "@/layouts/header";
import SearchFiltersClient from "./_components/SearchFiltersClient";
import SearchResultsClient from "./_components/SearchResultsClient";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE!;

export interface SearchProperty {
  id: number;
  name: string;
  description?: string;
  property_type: string;
  star_rating?: number;
  country: string;
  state?: string;
  city: string;
  address?: string;
  featured_image: string;
  images?: string[];
  amenities?: string[];
  bedrooms?: number;
  bathrooms?: number;
  max_guests?: number;
  price_from: string | null;
  price_currency: string;
  display_price?: number;
  rating_average: string | null;
  rating_count: number;
  is_featured: boolean;
  booking_count?: number;
  view_count?: number;
  instant_book?: boolean;
  provider: string;
  seo_slug?: string;
  api_data?: { bedrooms?: number; bathrooms?: number } | null;
}

interface SearchResult {
  data: SearchProperty[];
  total: number;
  current_page: number;
  last_page: number;
}

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

async function searchHotels(
  params: Record<string, string>,
): Promise<SearchResult> {
  const rawLocation = params.location || "";
  const location = rawLocation.includes(",")
    ? rawLocation.split(",")[0].trim()
    : rawLocation;

  const payload: Record<string, string | number> = {
    location,
  };
  if (params.checkIn) payload.checkIn = params.checkIn;
  if (params.checkOut) payload.checkOut = params.checkOut;
  if (params.guests) payload.guests = parseInt(params.guests, 10);
  if (params.propertyType) payload.propertyType = params.propertyType;
  if (params.minPrice) payload.minPrice = parseFloat(params.minPrice);
  if (params.maxPrice) payload.maxPrice = parseFloat(params.maxPrice);
  if (params.bedrooms) payload.bedrooms = parseInt(params.bedrooms, 10);
  if (params.bathrooms) payload.bathrooms = parseInt(params.bathrooms, 10);
  if (params.sort) payload.sort = params.sort;
  if (params.page) payload.page = parseInt(params.page, 10);

  try {
    const res = await fetch(`${API_BASE}/public/search/hotels`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return {
      data: (json.data?.data ?? []) as SearchProperty[],
      total: json.data?.total ?? 0,
      current_page: json.data?.current_page ?? 1,
      last_page: json.data?.last_page ?? 1,
    };
  } catch {
    return { data: [], total: 0, current_page: 1, last_page: 1 };
  }
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const params = await searchParams;
  const location = typeof params.location === "string" ? params.location : "";
  const checkIn = typeof params.checkIn === "string" ? params.checkIn : "";
  const checkOut = typeof params.checkOut === "string" ? params.checkOut : "";

  return {
    title: `${location ? `Hotels in ${location}` : "Search Hotels"} | PickPackGo`,
    description: `Find and book the best hotels${location ? ` in ${location}` : ""}${checkIn ? ` from ${checkIn}` : ""}${checkOut ? ` to ${checkOut}` : ""}.`,
  };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const rawParams = await searchParams;
  const params: Record<string, string> = Object.fromEntries(
    Object.entries(rawParams).filter(([, v]) => typeof v === "string"),
  ) as Record<string, string>;

  const {
    data: properties,
    total,
    current_page,
    last_page,
  } = await searchHotels(params);

  const nights = (() => {
    if (!params.checkIn || !params.checkOut) return 0;
    const diff =
      new Date(params.checkOut).getTime() - new Date(params.checkIn).getTime();
    return Math.max(0, Math.round(diff / (1000 * 60 * 60 * 24)));
  })();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Search bar section */}
      <div className="bg-[#0d1637] py-6">
        <SearchBar
          initialLocation={params.location ?? ""}
          initialCheckIn={params.checkIn ?? ""}
          initialCheckOut={params.checkOut ?? ""}
          initialGuests={params.guests ? parseInt(params.guests, 10) : 2}
        />
      </div>

      {/* Results summary */}
      <div className="bg-white border-b border-gray-200">
        <div className="global-container px-4 py-3">
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
            {params.location && (
              <span className="font-semibold text-[#0d1637] text-base">
                {params.location}
              </span>
            )}
            {params.checkIn && params.checkOut && (
              <>
                <span className="text-gray-300">·</span>
                <span>
                  {params.checkIn} — {params.checkOut}
                </span>
                {nights > 0 && (
                  <span className="text-gray-400">
                    ({nights} night{nights !== 1 ? "s" : ""})
                  </span>
                )}
              </>
            )}
            {params.guests && (
              <>
                <span className="text-gray-300">·</span>
                <span>
                  {params.guests} guest
                  {parseInt(params.guests, 10) !== 1 ? "s" : ""}
                </span>
              </>
            )}
            <span className="ml-auto text-emerald-600 font-semibold">
              {total} properties found
            </span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="global-container px-4 py-6">
        <div className="flex gap-6 items-start">
          {/* Filter sidebar */}
          <aside className="hidden lg:block w-72 shrink-0 self-start sticky top-24">
            <SearchFiltersClient
              initialParams={params}
              key={JSON.stringify(params)}
            />
          </aside>

          {/* Results */}
          <main className="flex-1 min-w-0">
            <SearchResultsClient
              properties={properties}
              total={total}
              current_page={current_page}
              last_page={last_page}
              params={params}
            />
          </main>
        </div>
      </div>
    </div>
  );
}
