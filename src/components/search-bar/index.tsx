"use client";

import { useState } from "react";
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
} from "lucide-react";

export default function SearchBar() {
  const [activeTab, setActiveTab] = useState("all-stays");
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [travelers, setTravelers] = useState(2);

  const tabs = [
    { value: "all-stays", label: "All Stays", icon: Home },
    { value: "hotels", label: "Hotels", icon: Building2 },
    { value: "rentals", label: "Rentals", icon: Hotel },
    { value: "flights", label: "Flights", icon: Plane },
    { value: "car-rentals", label: "Car Rentals", icon: Car },
    { value: "bundles", label: "Bundles", icon: Package },
    { value: "experiences", label: "Experiences", icon: Sparkles },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start bg-transparent border-b rounded-none h-auto p-0">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-green-600 data-[state=active]:bg-transparent data-[state=active]:text-green-600 px-6 py-4 gap-2"
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>

        {/* Search Fields */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            {/* Where to? */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Where to?
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search destinations"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="pl-10 h-12 border-gray-200 focus:border-green-500 focus:ring-green-500"
                />
              </div>
            </div>

            {/* Dates */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Dates</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full h-12 justify-start text-left font-normal border-gray-200 hover:border-green-500"
                  >
                    <CalendarIcon className="mr-2 h-5 w-5 text-gray-400" />
                    {checkIn && checkOut ? (
                      <span>
                        {format(checkIn, "MMM dd")} - {format(checkOut, "MMM dd")}
                      </span>
                    ) : (
                      <span className="text-gray-400">Add dates</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={checkIn}
                    onSelect={setCheckIn}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Travelers */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Travelers
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full h-12 justify-start text-left font-normal border-gray-200 hover:border-green-500"
                  >
                    <Users className="mr-2 h-5 w-5 text-gray-400" />
                    <span>{travelers} travelers</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64" align="start">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Adults</span>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setTravelers(Math.max(1, travelers - 1))}
                        >
                          -
                        </Button>
                        <span className="w-8 text-center">{travelers}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setTravelers(travelers + 1)}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Search Button */}
            <Button className="h-12 bg-green-600 hover:bg-green-700 text-white font-semibold text-base">
              <Search className="w-5 h-5 mr-2" />
              Search
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}