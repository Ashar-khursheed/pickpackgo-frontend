import {
  Building2,
  Car,
  Compass,
  DollarSign,
  Gem,
  Phone,
  Plane,
  RotateCcw,
  Shield,
  Tag,
  TrendingUp,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import BackgroundShasow from "@/assets/home/Background+Shadow.png";
import BGOne from "@/assets/home/Background+Shadow.svg";
import BeautifullAppartment from "@/assets/home/Beautiful rental apartment.png";
import Container from "@/assets/home/Container.svg";
import MobileBG from "@/assets/home/mobileBG.png";
import panelimg from "@/assets/home/panelimg.png";
import SectionBG from "@/assets/home/Section.png";
import Imag1 from "@/assets/home/Section.svg";
import DestinationCard from "@/components/destination-card";
import FaqAccordion from "@/components/faq-accordion";
import SearchBar from "@/components/search-bar";
import TestimonialCard from "@/components/testimonials-card";
import { Button } from "@/components/ui/button";
import VacationCard from "@/components/vacation-card";
import Header from "@/layouts/header";
import {
  AIICon,
  BotA,
  EasyTools,
  FastPayouts,
  FreeCheck,
  RewardIcon,
  RightIcon,
  RightIconGreen,
} from "@/utils/icon";
import { destinations, testimonials } from "@/utils/mock-data";

interface Property {
  id: number;
  name: string;
  city: string;
  state: string;
  address: string;
  featured_image: string;
  price_from: string;
  price_currency: string;
  property_type: string;
  is_featured: boolean;
  rating_average: string;
  seo_slug: string;
}

function mapPropertyType(
  type: string,
): "HOTEL" | "ENTIRE CONDO" | "APARTMENT" | "VILLA" {
  const map: Record<string, "HOTEL" | "ENTIRE CONDO" | "APARTMENT" | "VILLA"> =
    {
      hotel: "HOTEL",
      condo: "ENTIRE CONDO",
      apartment: "APARTMENT",
      villa: "VILLA",
      cabin: "VILLA",
      cottage: "VILLA",
      house: "VILLA",
      loft: "APARTMENT",
    };
  return map[type?.toLowerCase()] ?? "HOTEL";
}

async function getFeaturedProperties(): Promise<Property[]> {
  if (!process.env.NEXT_PUBLIC_API_BASE) return [];
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/public/properties/featured?limit=4`,
      { next: { revalidate: 3600 }, signal: AbortSignal.timeout(10000) },
    );
    const json = await res.json();
    return json.success ? json.data : [];
  } catch {
    return [];
  }
}

async function getTopRatedProperties(): Promise<Property[]> {
  if (!process.env.NEXT_PUBLIC_API_BASE) return [];
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/public/properties/top-rated?limit=4`,
      { next: { revalidate: 3600 }, signal: AbortSignal.timeout(10000) },
    );
    const json = await res.json();
    return json.success ? json.data : [];
  } catch {
    return [];
  }
}

const popularDestinations = [
  { label: "New York", href: "/property-listing?city=New York" },
  { label: "Los Angeles", href: "/property-listing?city=Los Angeles" },
  { label: "Miami", href: "/property-listing?city=Miami" },
  { label: "Las Vegas", href: "/property-listing?city=Las Vegas" },
  { label: "Chicago", href: "/property-listing?city=Chicago" },
  { label: "San Francisco", href: "/property-listing?city=San Francisco" },
];

const categories = [
  {
    label: "Trending Now",
    desc: "Most-booked stays this week",
    icon: TrendingUp,
    href: "/property-listing?sort_by=rating_desc",
    image:
      "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=800&q=80",
    color: "from-blue-900/70",
  },
  {
    label: "Luxury Stays",
    desc: "5-star villas & resorts",
    icon: Gem,
    href: "/property-listing?min_price=300",
    image:
      "https://images.pexels.com/photos/1743231/pexels-photo-1743231.jpeg?auto=compress&cs=tinysrgb&w=800&q=80",
    color: "from-purple-900/70",
  },
  {
    label: "Budget Friendly",
    desc: "Great stays under $80/night",
    icon: DollarSign,
    href: "/property-listing?max_price=80",
    image:
      "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800&q=80",
    color: "from-emerald-900/70",
  },
  {
    label: "Family Friendly",
    desc: "Spacious homes for the whole family",
    icon: Users,
    href: "/property-listing?property_type=villa",
    image:
      "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800&q=80",
    color: "from-orange-900/70",
  },
];

const whyUs = [
  {
    icon: Shield,
    title: "Secure Booking",
    desc: "SSL-encrypted payments. Your data and money are always protected.",
  },
  {
    icon: Tag,
    title: "Best Price Guarantee",
    desc: "Find a lower price anywhere? We'll match it — no questions asked.",
  },
  {
    icon: RotateCcw,
    title: "Free Cancellation",
    desc: "Flexible plans? Most stays offer free cancellation up to 24h before.",
  },
  {
    icon: Phone,
    title: "24/7 Support",
    desc: "Our travel experts are available around the clock to assist you.",
  },
];

const faqs = [
  {
    q: "Is PikPakGo free to use?",
    a: "Yes — searching, comparing, and saving properties is completely free. You only pay when you confirm a booking.",
  },
  {
    q: "What types of properties can I find?",
    a: "Everything from budget hostels and boutique hotels to luxury villas, private apartments, cabins, and unique stays. All in one unified search.",
  },
  {
    q: "Can I cancel or modify my booking?",
    a: "Most properties offer free cancellation up to 24–48 hours before check-in. Cancellation terms are clearly shown on every listing before you book.",
  },
  {
    q: "Is my payment information secure?",
    a: "Absolutely. All transactions are secured with 256-bit SSL encryption. We never store your full card details on our servers.",
  },
  {
    q: "How does the Best Price Guarantee work?",
    a: "If you find the same property at a lower price on another site within 24 hours of booking, contact our support team and we'll refund the difference.",
  },
  {
    q: "How do I list my property on PikPakGo?",
    a: "Sign up as a host for free, add your property details and photos, set your pricing, and start receiving bookings within minutes. No hidden listing fees.",
  },
];

export default async function Home() {
  const [featuredProperties, topRatedProperties] = await Promise.all([
    getFeaturedProperties(),
    getTopRatedProperties(),
  ]);

  return (
    <main className="relative w-full min-h-screen">
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <div className="relative">
        <Image
          src={Container}
          alt="PikPakGo hero"
          className="w-full md:h-auto md:block hidden"
        />
        <Image
          src={MobileBG}
          alt="PikPakGo hero"
          className="w-full h-[100vh] md:hidden block"
        />
        <div className="absolute inset-0 bg-black opacity-40" />
      </div>

      <div className="absolute top-0 left-0 w-full h-full">
        <Header />
        <div className="global-container">
          <div className="relative z-10 flex h-[100vh] items-center justify-center w-full">
            <div className="md:w-auto w-full">
              {/* Headline */}
              <h1 className="text-white font-bold md:text-6xl text-2xl text-center leading-tight">
                Book Hotels &amp; Vacation
                <span className="block text-emerald-300">
                  Rentals Worldwide
                </span>
              </h1>
              <p className="mt-4 text-white/90 text-center md:text-lg text-base">
                Hotels, Villas &amp; Travel Services — All Under One Roof.
              </p>

              {/* Search */}
              <div className="flex items-center justify-center px-4 mt-8">
                <SearchBar />
              </div>

              {/* Popular destinations quick links */}
              <div className="flex flex-wrap items-center justify-center gap-2 mt-5 px-4">
                <span className="text-white/70 text-xs font-medium mr-1">
                  Popular:
                </span>
                {popularDestinations.map((d) => (
                  <Link
                    key={d.label}
                    href={d.href}
                    className="text-xs font-medium text-white/90 bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/25 rounded-full px-3 py-1 transition-colors"
                  >
                    {d.label}
                  </Link>
                ))}
              </div>

              {/* AI planner chip */}
              <Link
                href="/trip-planner"
                className="block mx-auto md:w-[470px] w-full"
              >
                <div className="flex items-center justify-center gap-2.5 text-white border text-[12px] border-emerald-500/30 rounded-full p-2 backdrop-blur-md bg-emerald-500/10 mt-5 hover:bg-emerald-500/20 hover:border-emerald-500/50 transition-all duration-300 cursor-pointer shadow-lg shadow-emerald-500/5 group">
                  <span className="flex items-center gap-1.5 font-semibold text-emerald-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <AIICon />
                    Use AI Trip Planner
                  </span>
                  <span className="text-white/60">|</span>
                  <span className="flex items-center gap-1 text-white/90">
                    Get personalized itineraries
                    <RightIcon />
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── TRUST INDICATORS ─────────────────────────────────────── */}
      <section className="bg-[#0d1637] py-4">
        <div className="global-container">
          <div className="grid md:grid-cols-4 grid-cols-2 gap-3">
            {[
              { icon: Shield, label: "Secure Booking" },
              { icon: Tag, label: "Best Price Guarantee" },
              { icon: RotateCcw, label: "Free Cancellation" },
              { icon: Phone, label: "24/7 Support" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 justify-center"
              >
                <Icon className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-white/90 text-xs md:text-sm font-medium">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TOP DESTINATIONS ─────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="global-container">
          <div className="grid md:grid-cols-2 grid-cols-1 gap-4 items-center justify-between">
            <div>
              <h2 className="text-[#0d1637] md:text-3xl text-xl font-extrabold">
                Top Destinations for 2026
              </h2>
              <p className="text-[#64748B] md:text-xl text-base font-light mt-3">
                Curated getaways for your next adventure. Explore the world's
                most stunning locations with exclusive PikPakGo deals.
              </p>
            </div>
            <div className="text-right">
              <Link
                href="/property-listing"
                className="flex gap-2.5 justify-end items-center text-[#16A34A] font-bold md:text-xl text-base"
              >
                View all destinations
                <RightIconGreen />
              </Link>
            </div>
          </div>

          <div className="mt-7">
            <div className="grid 2xl:grid-cols-4 md:grid-cols-3 grid-cols-1 gap-6">
              {destinations?.map((destination, index) => (
                <div key={index}>
                  <DestinationCard
                    image={destination.image}
                    city={destination.city}
                    country={destination.country}
                    propertyCount={destination.propertyCount}
                    isTopRated={destination.isTopRated}
                    id={1}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* ── TRAVEL SERVICES ──────────────────────────────────── */}
          <div className="pt-24 md:text-center text-left">
            <h2 className="text-[#0d1637] md:text-5xl font-bold text-xl">
              Travel Services
            </h2>
            <p className="text-[#475569] md:text-lg text-base font-light mt-4">
              We provide a complete ecosystem for all your travel needs.
            </p>

            <div className="grid md:grid-cols-4 grid-cols-1 gap-8 mt-10">
              {[
                {
                  icon: Plane,
                  title: "Flights",
                  desc: "Best prices on global flights",
                  href: "/flights",
                },
                {
                  icon: Building2,
                  title: "Hotels & Stays",
                  desc: "Luxury to budget accommodations",
                  href: "/property-listing",
                },
                {
                  icon: Car,
                  title: "Car Rentals",
                  desc: "Flexible pickup & drop-off",
                  href: "/cars",
                },
                {
                  icon: Compass,
                  title: "Experiences",
                  desc: "Tours, events & activities",
                  href: "/experiences",
                },
              ].map(({ icon: Icon, title, desc, href }) => (
                <Link
                  key={title}
                  href={href}
                  className="bg-gradient-to-b from-slate-50 to-slate-100/50 rounded-3xl p-8 text-center border border-slate-200/60 hover:border-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/[0.02] hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center gap-4 group"
                >
                  <div className="w-12 h-12 bg-white rounded-2xl shadow-md border border-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h3 className="text-slate-900 font-bold text-lg md:text-xl">
                    {title}
                  </h3>
                  <p className="text-slate-500 text-sm md:text-base leading-relaxed">
                    {desc}
                  </p>
                </Link>
              ))}
            </div>

            <div className="text-center">
              <Link href="/trip-planner">
                <Button className="mt-10 bg-white hover:bg-green-700 cursor-pointer text-black md:text-lg border border-[#CBD5E1] hover:text-white text-base font-medium px-10 py-6 rounded-md hover:shadow-xl transition-all duration-300">
                  View All Services
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY BOOK WITH PIKPAKGO ───────────────────────────────── */}
      <section className="py-20 bg-[#F8FAFC]">
        <div className="global-container">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-full uppercase tracking-wide mb-4">
              Why PikPakGo
            </span>
            <h2 className="text-[#0d1637] md:text-4xl text-2xl font-extrabold">
              Why Book With PikPakGo?
            </h2>
            <p className="text-[#64748B] md:text-lg text-base font-light mt-3 max-w-2xl mx-auto">
              Millions of travelers trust PikPakGo for transparent pricing, real
              reviews, and zero hidden fees.
            </p>
          </div>

          <div className="grid md:grid-cols-4 grid-cols-2 gap-6">
            {whyUs.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="bg-white rounded-3xl p-6 flex flex-col items-center text-center gap-4 border border-slate-100/80 shadow-xs hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="font-bold text-[#0d1637] md:text-lg text-base">
                  {title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PROPERTIES ─────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="global-container">
          <div className="text-center mb-8">
            <h2 className="text-[#0d1637] md:text-3xl text-xl font-extrabold">
              Hotels + Vacation Rentals — Together in One Search
            </h2>
            <p className="text-[#64748B] md:text-xl text-base font-light mt-3">
              Compare before you book. See a luxury hotel and a private villa on
              the same map, with the same search.
            </p>
          </div>

          <div className="grid 2xl:grid-cols-4 md:grid-cols-3 grid-cols-1 gap-8">
            {featuredProperties.map((property) => (
              <Link key={property.id} href={`/property-listing/${property.id}`}>
                <VacationCard
                  image={property.featured_image}
                  title={property.name}
                  location={`${property.city}, ${property.state}`}
                  distance={property.address}
                  price={parseFloat(property.price_from)}
                  type={mapPropertyType(property.property_type)}
                  badge={property.is_featured ? "Featured" : undefined}
                  rating={
                    property.rating_average
                      ? parseFloat(property.rating_average)
                      : undefined
                  }
                  freeCancellation
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── TOP RATED PROPERTIES ────────────────────────────────── */}
      <section className="py-20 bg-[#F8FAFC]">
        <div className="global-container">
          <div className="grid md:grid-cols-2 grid-cols-1 gap-4 items-center justify-between mb-8">
            <div>
              <h2 className="text-[#0d1637] md:text-3xl text-xl font-extrabold">
                Top Rated Properties
              </h2>
              <p className="text-[#64748B] md:text-xl text-base font-light mt-3">
                Handpicked stays loved by our guests. Highest-rated properties
                across every category.
              </p>
            </div>
            <div className="text-right">
              <Link
                href="/property-listing"
                className="flex gap-2.5 justify-end items-center text-[#16A34A] font-bold md:text-xl text-base"
              >
                View all properties
                <RightIconGreen />
              </Link>
            </div>
          </div>

          <div className="grid 2xl:grid-cols-4 md:grid-cols-3 grid-cols-1 gap-8">
            {topRatedProperties.map((property) => (
              <Link key={property.id} href={`/property-listing/${property.id}`}>
                <VacationCard
                  image={property.featured_image}
                  title={property.name}
                  location={`${property.city}, ${property.state}`}
                  distance={property.address}
                  price={parseFloat(property.price_from)}
                  type={mapPropertyType(property.property_type)}
                  badge={
                    parseFloat(property.rating_average) >= 4.8
                      ? "Top Rated"
                      : undefined
                  }
                  rating={
                    property.rating_average
                      ? parseFloat(property.rating_average)
                      : undefined
                  }
                  freeCancellation
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── BROWSE BY CATEGORY ──────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="global-container">
          <div className="text-center mb-12">
            <h2 className="text-[#0d1637] md:text-4xl text-2xl font-extrabold">
              Browse by Category
            </h2>
            <p className="text-[#64748B] md:text-lg text-base font-light mt-3">
              From last-minute budget picks to bucket-list luxury escapes.
            </p>
          </div>

          <div className="grid md:grid-cols-4 grid-cols-2 gap-5">
            {categories.map(
              ({ label, desc, icon: Icon, href, image, color }) => (
                <Link key={label} href={href} className="group block">
                  <div className="relative rounded-2xl overflow-hidden h-48 md:h-64 shadow-md hover:shadow-xl transition-shadow duration-300">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                      style={{ backgroundImage: `url(${image})` }}
                    />
                    <div
                      className={`absolute inset-0 bg-linear-to-t ${color} to-transparent`}
                    />
                    <div className="relative h-full flex flex-col justify-end p-5">
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className="w-4 h-4 text-white/90" />
                        <span className="text-white font-bold md:text-lg text-base">
                          {label}
                        </span>
                      </div>
                      <span className="text-white/80 text-xs">{desc}</span>
                    </div>
                  </div>
                </Link>
              ),
            )}
          </div>
        </div>
      </section>

      {/* ── AI TRIP PLANNER (desktop) ────────────────────────────── */}
      <section className="py-20 bg-white md:block hidden">
        <div className="global-container relative">
          <div className="relative">
            <Image
              src={BackgroundShasow}
              alt="AI Trip Planner background"
              className="w-full h-auto"
            />
          </div>
          <div className="absolute top-0 flex flex-col items-start justify-center h-full pl-30">
            <div className="flex gap-2.5 items-center">
              <BotA />
              <h2 className="text-white font-light md:text-lg text-base">
                PikPakGo Intelligence
              </h2>
            </div>
            <div className="py-3.5 2xl:pt-12 md:pt-7">
              <h2 className="2xl:text-6xl md:text-3xl text-lg text-white font-bold">
                Let AI plan your next trip in
                <span className="block">seconds.</span>
              </h2>
            </div>
            <div className="py-3.5">
              <p className="text-[#DBEAFE] 2xl:text-xl md:text-base text-sm font-light">
                Tell us where you want to go and what you love — we'll build
                <span className="block">
                  your stay and activities automatically.
                </span>
              </p>
            </div>
            <div className="py-3.5">
              <Link href="/trip-planner">
                <Button className="group bg-white hover:bg-white cursor-pointer text-[#16A34A] md:text-lg border border-[#CBD5E1] hover:text-[#16A34A] text-base font-medium h-13.75 rounded-md hover:shadow-xl transition-all duration-300 p-0">
                  <span className="flex items-center gap-2.5 2xl:px-7.5 px-5">
                    <span>Launch AI Trip Planner</span>
                    <RightIconGreen />
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* AI Trip Planner (mobile) */}
      <section className="bg-white md:hidden block">
        <div className="global-container">
          <Image
            src={BGOne}
            alt="AI Trip Planner"
            className="md:hidden block"
          />
        </div>
      </section>

      {/* ── EARN REWARDS ────────────────────────────────────────── */}
      <section className="md:py-20 pb-10 bg-white relative">
        <div className="global-container relative">
          <div className="grid grid-cols-1 justify-center items-center text-center">
            <h2 className="text-[#0d1637] md:text-3xl text-xl font-bold">
              Earn Rewards Every Time You Travel
            </h2>
            <p className="text-[#475569] md:text-xl text-base font-light mt-4">
              Join free and start earning credits on your first booking.
            </p>
          </div>

          <div className="grid md:grid-cols-3 grid-cols-1 gap-8 mt-10">
            {/* Bronze Card */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 p-8 py-12 flex flex-col items-center justify-between gap-4 rounded-3xl border border-orange-200/50 hover:shadow-xl hover:shadow-orange-500/[0.04] hover:-translate-y-1.5 transition-all duration-300">
              <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-orange-100 flex items-center justify-center">
                <RewardIcon color="#EA580C" />
              </div>
              <h5 className="text-orange-950 md:text-xl text-base font-extrabold uppercase tracking-wider">
                Bronze
              </h5>
              <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600 md:text-5xl text-3xl font-extrabold">
                3%
              </h2>
              <p className="text-orange-850/85 text-sm font-medium text-center leading-relaxed">
                Cash back on every eligible booking
              </p>
            </div>

            {/* Silver Card */}
            <div className="bg-gradient-to-br from-slate-50 to-slate-200/50 p-8 py-12 flex flex-col items-center justify-between gap-4 rounded-3xl border border-slate-300/40 hover:shadow-xl hover:shadow-slate-500/[0.04] hover:-translate-y-1.5 transition-all duration-300">
              <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center">
                <RewardIcon color="#64748B" />
              </div>
              <h5 className="text-slate-950 md:text-xl text-base font-extrabold uppercase tracking-wider">
                Silver
              </h5>
              <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-slate-600 to-slate-800 md:text-5xl text-3xl font-extrabold">
                8%
              </h2>
              <p className="text-slate-800/85 text-sm font-medium text-center leading-relaxed">
                Cash back on every eligible booking
              </p>
            </div>

            {/* Gold Card */}
            <div className="bg-gradient-to-br from-yellow-50 to-amber-100/60 p-8 py-12 flex flex-col items-center justify-between gap-4 rounded-3xl border border-amber-300/40 hover:shadow-xl hover:shadow-yellow-500/[0.04] hover:-translate-y-1.5 transition-all duration-300">
              <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-amber-200 flex items-center justify-center">
                <RewardIcon color="#CA8A04" />
              </div>
              <h5 className="text-amber-950 md:text-xl text-base font-extrabold uppercase tracking-wider">
                Gold
              </h5>
              <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-yellow-600 md:text-5xl text-3xl font-extrabold">
                13%
              </h2>
              <p className="text-amber-900/85 text-sm font-medium text-center leading-relaxed">
                Cash back on every eligible booking
              </p>
            </div>
          </div>

          <div className="grid place-items-center">
            <Button className="mt-10 bg-white hover:bg-green-700 cursor-pointer text-black md:text-lg border border-[#CBD5E1] hover:text-white text-base font-medium px-10 py-6 rounded-md hover:shadow-xl transition-all duration-300">
              Join Rewards — It's Free
            </Button>
          </div>
        </div>
      </section>

      {/* ── CORPORATE / AGENCY ──────────────────────────────────── */}
      <section className="py-28 bg-[#F8FAFC] relative">
        <div className="global-container relative">
          <div className="grid md:grid-cols-2 grid-cols-1 items-center justify-between">
            <div>
              <div className="self-start">
                <span className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-800 text-[12px] font-semibold rounded-full uppercase tracking-wide">
                  For Professionals
                </span>
              </div>
              <h2 className="text-[#0d1637] 2xl:text-5xl md:text-3xl text-xl font-bold py-5">
                Travel Agencies &amp;
                <span className="block">Corporate Partners</span>
              </h2>
              <p className="text-[#475569] 2xl:text-xl md:text-base text-sm font-light mt-4">
                Use PikPakGo's inventory under your own brand. Access our
                white-label portal to manage bookings, markups, and commissions
                in one dashboard.
              </p>
              <div className="pt-8">
                <Button className="bg-[#16A34A] hover:bg-white cursor-pointer text-white 2xl:text-lg md:text-base text-sm border border-[#16A34A] hover:text-[#16A34A] font-medium h-13.75 rounded-md hover:shadow-xl transition-all duration-300">
                  Learn about White-Label Access
                </Button>
              </div>
            </div>
            <div className="md:mt-0 mt-5">
              <Image
                src={panelimg}
                alt="Corporate Travel Dashboard"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── LIST YOUR PROPERTY (desktop) ────────────────────────── */}
      <section className="relative text-white md:block hidden">
        <div className="relative">
          <Image
            src={SectionBG}
            alt="List your property"
            className="w-full h-auto"
          />
        </div>
        <div className="absolute top-0 flex flex-col items-start justify-center w-full h-full">
          <div className="global-container relative">
            <div className="grid md:grid-cols-2 grid-cols-1 gap-4 items-center justify-between">
              <div>
                <h2 className="2xl:text-7xl md:text-4xl text-xl font-bold">
                  List Your Property.
                  <span className="block">No Hidden Fees.</span>
                </h2>
                <p className="text-[#CBD5E1] md:text-xl text-base font-light mt-4 py-4">
                  Join thousands of hosts earning more with PikPakGo. We make
                  hosting simple, secure, and profitable.
                </p>

                <div className="flex gap-8 mt-5">
                  <div>
                    <FreeCheck />
                    <h4 className="md:text-base text-sm font-bold pt-3">
                      Free Signup
                    </h4>
                    <p className="text-[#CBD5E1] pt-1.5 text-sm">
                      No credit card required.
                    </p>
                  </div>
                  <div>
                    <EasyTools />
                    <h4 className="md:text-base text-sm font-bold pt-3">
                      Easy Management
                    </h4>
                    <p className="text-[#CBD5E1] pt-1.5 text-sm">
                      Powerful tools in one dashboard.
                    </p>
                  </div>
                  <div>
                    <FastPayouts />
                    <h4 className="md:text-base text-sm font-bold pt-3">
                      Fast Payouts
                    </h4>
                    <p className="text-[#CBD5E1] pt-1.5 text-sm">
                      Get paid within 24 hours.
                    </p>
                  </div>
                </div>

                <Button className="mt-10 bg-emerald-600 hover:bg-emerald-700 cursor-pointer text-white md:text-lg hover:text-white text-base font-medium px-10 py-6 rounded-sm hover:shadow-xl transition-all duration-300">
                  Start Hosting Today
                </Button>
              </div>
              <div>
                <Image
                  src={BeautifullAppartment}
                  alt="Beautiful rental apartment"
                  className="w-full h-auto mt-10"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* List Your Property (mobile) */}
      <section className="relative text-white md:hidden block">
        <div className="global-container relative">
          <div className="relative">
            <Image
              src={Imag1}
              alt="List your property"
              className="w-full h-auto rounded-md"
            />
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="global-container">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-[#0d1637] md:text-4xl text-2xl font-extrabold">
                Frequently Asked Questions
              </h2>
              <p className="text-[#64748B] md:text-lg text-base font-light mt-3">
                Everything you need to know before you book.
              </p>
            </div>

            <FaqAccordion faqs={faqs} />
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ────────────────────────────────────────── */}
      <section className="py-28 bg-[#F8FAFC] relative">
        <div className="global-container relative">
          <div className="text-center mb-3">
            <h2 className="text-[#0d1637] md:text-3xl text-xl font-bold">
              Loved by Travelers &amp; Agencies
            </h2>
            <p className="text-[#64748B] md:text-lg text-base font-light mt-3">
              Real reviews from real guests — no filters.
            </p>
          </div>

          <div className="grid md:grid-cols-4 grid-cols-1 gap-4 items-stretch">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="mt-10">
                <TestimonialCard
                  rating={testimonial.rating}
                  testimonial={testimonial.testimonial}
                  name={testimonial.name}
                  title={testimonial.title}
                  image={testimonial.image}
                />
              </div>
            ))}
          </div>

          {/* Stats row */}
          <div className="mt-16 grid md:grid-cols-4 grid-cols-2 gap-6">
            {[
              { value: "2M+", label: "Happy Travelers" },
              { value: "150K+", label: "Properties Listed" },
              { value: "190+", label: "Countries Covered" },
              { value: "4.9★", label: "Average Rating" },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-[#0d1637] md:text-4xl text-2xl font-extrabold">
                  {value}
                </div>
                <div className="text-[#64748B] text-sm mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
