"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  Home,
  Building2,
  Hotel,
  Plane,
  Car,
  Package,
  Sparkles,
  MapPin,
  CalendarIcon,
  Users,
  Search,
  Minus,
  Plus,
} from "lucide-react";

interface SearchBarProps {
  initialLocation?: string;
  initialCheckIn?: string;
  initialCheckOut?: string;
  initialGuests?: number;
}

interface CityResult {
  type: "city";
  label: string;
  value: string;
  property_count: number;
  country_code: string;
}

interface PropertyResult {
  type: "property";
  label: string;
  value: string;
  seo_slug: string;
  subtitle: string;
  image: string;
  price_from: string;
  currency: string;
}

type AutocompleteResult = CityResult | PropertyResult;

export default function SearchBar({
  initialLocation = "",
  initialCheckIn = "",
  initialCheckOut = "",
  initialGuests = 2,
}: SearchBarProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all-stays");
  const [destination, setDestination] = useState(initialLocation);
  const [checkIn, setCheckIn] = useState<Date | undefined>(
    initialCheckIn ? new Date(initialCheckIn) : undefined
  );
  const [checkOut, setCheckOut] = useState<Date | undefined>(
    initialCheckOut ? new Date(initialCheckOut) : undefined
  );
  const [guests, setGuests] = useState(initialGuests);
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [checkOutOpen, setCheckOutOpen] = useState(false);
  const [guestsOpen, setGuestsOpen] = useState(false);

  const [suggestions, setSuggestions] = useState<AutocompleteResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchSuggestions = useCallback(async (query: string) => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }
    setLoadingSuggestions(true);
    try {
      const res = await fetch(
        `/api/autocomplete?q=${encodeURIComponent(query)}&limit=7`
      );
      const json = await res.json();
      if (json.success) {
        setSuggestions(json.data);
        setShowDropdown(true);
      }
    } catch {
      setSuggestions([]);
    } finally {
      setLoadingSuggestions(false);
    }
  }, []);

  const handleDestinationChange = (value: string) => {
    setDestination(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(value), 300);
  };

  const handleSelectCity = (item: CityResult) => {
    setDestination(item.label);
    setSuggestions([]);
    setShowDropdown(false);
  };

  const handleSelectProperty = (item: PropertyResult) => {
    setDestination(item.label);
    setSuggestions([]);
    setShowDropdown(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const tabs = [
    { value: "all-stays", label: "All Stays", icon: Home },
    { value: "hotels", label: "Hotels", icon: Building2 },
    { value: "flights", label: "Flights", icon: Plane },
    { value: "car-rentals", label: "Car Rentals", icon: Car },
    { value: "experiences", label: "Experiences", icon: Sparkles },
  ];

  const handleSearch = () => {
    if (!destination.trim()) return;
    setShowDropdown(false);
    const p = new URLSearchParams();
    p.set("location", destination.trim());
    if (checkIn) p.set("checkIn", format(checkIn, "yyyy-MM-dd"));
    if (checkOut) p.set("checkOut", format(checkOut, "yyyy-MM-dd"));
    p.set("guests", String(guests));
    
    if (activeTab === "flights") {
      router.push(`/flights?${p.toString()}`);
    } else if (activeTab === "car-rentals") {
      router.push(`/cars?${p.toString()}`);
    } else if (activeTab === "experiences") {
      router.push(`/experiences?${p.toString()}`);
    } else {
      router.push(`/search?${p.toString()}`);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div className="bg-white rounded-2xl shadow-lg">
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start bg-transparent border-b rounded-none h-auto p-0 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-600 data-[state=active]:bg-transparent data-[state=active]:text-emerald-600 px-4 py-3 gap-2 shrink-0"
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline text-sm">{tab.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>

        {/* Search Fields */}
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
            {/* Where to? */}
            <div className="space-y-1.5 md:col-span-1">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Where to?
              </label>
              <div className="relative" ref={containerRef}>
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600 z-10" />
                <Input
                  placeholder="City, area, property name"
                  value={destination}
                  onChange={(e) => handleDestinationChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch();
                    if (e.key === "Escape") setShowDropdown(false);
                  }}
                  onFocus={() => { if (suggestions.length > 0) setShowDropdown(true); }}
                  className="pl-9 h-11 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 text-sm"
                  autoComplete="off"
                />

                {showDropdown && (
                  <div className="absolute w-[428px] top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden max-h-80 overflow-y-auto">
                    {loadingSuggestions ? (
                      <div className="px-4 py-3 text-sm text-gray-500">Searching...</div>
                    ) : suggestions.length === 0 ? (
                      <div className="px-4 py-3 text-sm text-gray-500">No results found</div>
                    ) : (
                      suggestions.map((item, i) => {
                        if (item.type === "city") {
                          return (
                            <button
                              key={i}
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => handleSelectCity(item)}
                              className="w-full cursor-pointer flex items-center gap-3 px-4 py-3 hover:bg-emerald-50 transition-colors text-left"
                            >
                              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                                <MapPin className="w-4 h-4 text-emerald-600" />
                              </div>
                              <div className="flex-1 min-w-0 cu">
                                <p className="text-sm font-medium text-gray-900 truncate">{item.label}</p>
                                <p className="text-xs text-gray-500">{item.property_count} properties</p>
                              </div>
                              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0">
                                City
                              </span>
                            </button>
                          );
                        }
                        return (
                          <button
                            key={i}
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => handleSelectProperty(item)}
                            className="w-full flex cursor-pointer items-center gap-3 px-4 py-3 hover:bg-emerald-50 transition-colors text-left"
                          >
                            <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                              <Image
                                src={item.image}
                                alt={item.label}
                                width={40}
                                height={40}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{item.label}</p>
                              <p className="text-xs text-gray-500 truncate">{item.subtitle}</p>
                            </div>
                            <span className="text-xs font-semibold text-gray-700 shrink-0">
                              ${item.price_from}
                              <span className="text-[10px] font-normal text-gray-400">/night</span>
                            </span>
                          </button>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Check-in */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Check-in
              </label>
              <Popover open={checkInOpen} onOpenChange={setCheckInOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full h-11 justify-start text-left font-normal border-gray-200 hover:border-emerald-500 text-sm"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-emerald-600 shrink-0" />
                    {checkIn ? (
                      <span className="text-gray-800">{format(checkIn, "MMM d, yyyy")}</span>
                    ) : (
                      <span className="text-gray-400">Add date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 z-200" align="start">
                  <Calendar
                    mode="single"
                    selected={checkIn}
                    onSelect={(d) => { setCheckIn(d); setCheckInOpen(false); }}
                    disabled={(d) => d < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Check-out */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Check-out
              </label>
              <Popover open={checkOutOpen} onOpenChange={setCheckOutOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full h-11 justify-start text-left font-normal border-gray-200 hover:border-emerald-500 text-sm"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-emerald-600 shrink-0" />
                    {checkOut ? (
                      <span className="text-gray-800">{format(checkOut, "MMM d, yyyy")}</span>
                    ) : (
                      <span className="text-gray-400">Add date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 z-200" align="start">
                  <Calendar
                    mode="single"
                    selected={checkOut}
                    onSelect={(d) => { setCheckOut(d); setCheckOutOpen(false); }}
                    disabled={(d) => d < (checkIn ?? new Date())}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Guests */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Guests
              </label>
              <Popover open={guestsOpen} onOpenChange={setGuestsOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full h-11 justify-start text-left font-normal border-gray-200 hover:border-emerald-500 text-sm"
                  >
                    <Users className="mr-2 h-4 w-4 text-emerald-600 shrink-0" />
                    <span className="text-gray-800">{guests} {guests === 1 ? "guest" : "guests"}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 z-200" align="start">
                  <div className="p-2">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Guests</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-800">Adults</span>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setGuests(Math.max(1, guests - 1))}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-emerald-500 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center font-semibold text-gray-900">{guests}</span>
                        <button
                          onClick={() => setGuests(guests + 1)}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-emerald-500 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <Button
                      onClick={() => setGuestsOpen(false)}
                      className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white h-9 text-sm"
                    >
                      Done
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Search Button */}
            <Button
              onClick={handleSearch}
              className="h-11 cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm"
            >
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
