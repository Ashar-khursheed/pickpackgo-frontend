import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/layouts/header";
import MobileFilterSheet from "./_components/MobileFilterSheet";
import PropertyFiltersClient from "./_components/PropertyFiltersClient";
import PropertyListClient from "./_components/PropertyListClient";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE!;

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
  star_rating?: number;
  bedrooms?: number;
  bathrooms?: number;
  max_guests?: number;
  seo_slug?: string;
  api_data?: { bedrooms?: number; bathrooms?: number } | null;
}

interface PageResult {
  data: Property[];
  total: number;
  current_page: number;
  last_page: number;
}

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

async function fetchProperties(
  params: Record<string, string>,
): Promise<PageResult> {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v) qs.set(k, v);
  }
  if (!qs.has("per_page")) qs.set("per_page", "20");

  try {
    const res = await fetch(`${API_BASE}/public/properties?${qs.toString()}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return {
      data: (json.data?.data ?? []) as Property[],
      total: (json.data?.total ?? 0) as number,
      current_page: (json.data?.current_page ?? 1) as number,
      last_page: (json.data?.last_page ?? 1) as number,
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
  const city = typeof params.city === "string" ? params.city : "";
  const propType =
    typeof params.property_type === "string" ? params.property_type : "";
  const location = typeof params.location === "string" ? params.location : "";

  const titleParts = ["Properties"];
  if (city) titleParts.push(`in ${city}`);
  else if (location) titleParts.push(`near ${location}`);
  if (propType)
    titleParts.push(
      `· ${propType.charAt(0).toUpperCase()}${propType.slice(1)}`,
    );
  const title = titleParts.join(" ");

  return {
    title: `${title} | PickPackGo`,
    description: `Browse vacation rentals and ${propType || "properties"}${city ? ` in ${city}` : ""}. Find and book your perfect stay.`,
    openGraph: {
      title: `${title} | PickPackGo`,
      description: `Browse vacation rentals${city ? ` in ${city}` : ""}. Find and book your perfect stay.`,
      type: "website",
    },
    alternates: {
      canonical: `/property-listing${
        new URLSearchParams(
          Object.fromEntries(
            Object.entries(params).filter(([, v]) => typeof v === "string"),
          ) as Record<string, string>,
        ).toString()
          ? `?${new URLSearchParams(
              Object.fromEntries(
                Object.entries(params).filter(([, v]) => typeof v === "string"),
              ) as Record<string, string>,
            ).toString()}`
          : ""
      }`,
    },
  };
}

export default async function PropertyListingPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const rawParams = await searchParams;

  const stringParams: Record<string, string> = Object.fromEntries(
    Object.entries(rawParams).filter(([, v]) => typeof v === "string"),
  ) as Record<string, string>;

  const {
    data: properties,
    total,
    current_page,
    last_page,
  } = await fetchProperties(stringParams);

  const heading =
    stringParams.city || stringParams.location || "All Properties";
  const hasFilters = Object.keys(stringParams).some(
    (k) => !["page", "per_page"].includes(k),
  );
  const activeFilterCount = Object.keys(stringParams).filter(
    (k) => !["page", "per_page"].includes(k),
  ).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="global-container mx-auto px-4 py-6">
        {/* Page heading banner */}
        <div className="bg-[#0d1637] rounded-xl px-6 py-5 mb-6">
          <h1 className="text-2xl font-bold text-white mb-1">{heading}</h1>
          <p className="text-sm text-white/60">
            {total} {total === 1 ? "property" : "properties"} found
            {hasFilters && (
              <Link
                href="/property-listing"
                className="ml-3 text-emerald-400 hover:text-emerald-300 text-xs font-medium"
              >
                Clear filters
              </Link>
            )}
          </p>
        </div>

        <div className="flex gap-6 items-start">
          {/* Desktop Filter Sidebar — self-start keeps sticky working inside flex */}
          <aside className="hidden lg:block w-72 shrink-0 self-start sticky 2xl:top-56 xl:top-48 top-32">
            <PropertyFiltersClient
              key={JSON.stringify(stringParams)}
              initialParams={stringParams}
            />
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Mobile filter bar */}
            <div className="lg:hidden flex items-center gap-3 mb-4">
              <MobileFilterSheet
                initialParams={stringParams}
                hasFilters={hasFilters}
                activeFilterCount={activeFilterCount}
              />
              <span className="text-sm text-gray-500">{total} results</span>
            </div>

            {/* Property list / grid */}
            <PropertyListClient
              properties={properties}
              total={total}
              initialParams={stringParams}
            />

            {/* Pagination */}
            {last_page > 1 && (
              <nav
                className="flex justify-center items-center mt-8 gap-2"
                aria-label="Pagination"
              >
                {current_page > 1 && (
                  <Link
                    href={`/property-listing?${new URLSearchParams({ ...stringParams, page: String(current_page - 1) })}`}
                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white hover:bg-gray-50"
                  >
                    ← Previous
                  </Link>
                )}
                <span className="px-4 py-2 text-sm text-gray-600">
                  Page {current_page} of {last_page}
                </span>
                {current_page < last_page && (
                  <Link
                    href={`/property-listing?${new URLSearchParams({ ...stringParams, page: String(current_page + 1) })}`}
                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white hover:bg-gray-50"
                  >
                    Next →
                  </Link>
                )}
              </nav>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
