'use client';

import { useState } from 'react';
import { Heart, MapPin, Star, List, Map, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import Header from '@/layouts/header';
import { mockProperties } from '@/utils/mock-data';
import Link from 'next/link';


export default function AccommodationListing() {
  const [priceRange, setPriceRange] = useState([50, 800]);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return newFavorites;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header/>
    

      {/* Main Content */}
      <div className="global-container mx-auto px-4 py-6">
        {/* Search Summary */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-1">Anywhere</h2>
          <p className="text-sm text-gray-600">6 results • Oct 12 - Oct 16 • 2 guests</p>
        </div>

        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <Card className="overflow-hidden shadow-none ">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <SlidersHorizontal className="w-5 h-5" />
                  <h3 className="font-semibold">Filters</h3>
                </div>

                {/* Price Range */}
                <div className="mb-8">
                  <h4 className="font-medium mb-4">Price range</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Nightly prices before fees
                  </p>
                  <Slider
                    min={0}
                    max={1000}
                    step={10}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="mb-4"
                  />
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={`$${priceRange[0]}`}
                        readOnly
                        className="w-full px-3 py-2 border rounded-md text-sm"
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        value={`$${priceRange[1]}+`}
                        readOnly
                        className="w-full px-3 py-2 border rounded-md text-sm"
                      />
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Type of place */}
                <div className="mb-8">
                  <h4 className="font-medium mb-4">Type of place</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="hotel" />
                      <label htmlFor="hotel" className="text-sm font-normal cursor-pointer">
                        Hotel
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="apartment" />
                      <label htmlFor="apartment" className="text-sm font-normal cursor-pointer">
                        Entire Home / Apt
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="resort" />
                      <label htmlFor="resort" className="text-sm font-normal cursor-pointer">
                        Resort
                      </label>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Amenities */}
                <div className="mb-8">
                  <h4 className="font-medium mb-4">Amenities</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="wifi" />
                      <label htmlFor="wifi" className="text-sm font-normal cursor-pointer">
                        WiFi
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="pool" />
                      <label htmlFor="pool" className="text-sm font-normal cursor-pointer">
                        Pool
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="kitchen" />
                      <label htmlFor="kitchen" className="text-sm font-normal cursor-pointer">
                        Kitchen
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="ac" />
                      <label htmlFor="ac" className="text-sm font-normal cursor-pointer">
                        Air Conditioning
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="pet" />
                      <label htmlFor="pet" className="text-sm font-normal cursor-pointer">
                        Pet Friendly
                      </label>
                    </div>
                  </div>
                  <Button variant="link" className="mt-3 p-0 h-auto text-emerald-600">
                    Show more
                  </Button>
                </div>

                <Separator className="my-6" />

                {/* Booking options */}
                <div>
                  <h4 className="font-medium mb-4">Booking options</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label htmlFor="instant" className="text-sm font-normal cursor-pointer">
                        Instant Book
                      </label>
                      <Switch id="instant" />
                    </div>
                    <div className="flex items-center justify-between">
                      <label htmlFor="checkin" className="text-sm font-normal cursor-pointer">
                        Self check-in
                      </label>
                      <Switch id="checkin" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Property Listings */}
          <main className="flex-1">
            {/* View Toggle */}
            <div className="flex items-center justify-end mb-4">
              <div className="flex items-center gap-2 bg-white border rounded-lg p-1">
                <Button
                  variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="gap-2"
                >
                  <List className="w-4 h-4" />
                  List
                </Button>
                <Button
                  variant={viewMode === 'map' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('map')}
                  className="gap-2"
                >
                  <Map className="w-4 h-4" />
                  Map
                </Button>
              </div>
            </div>

            {/* Properties Grid */}
            <div className="space-y-4">
              {mockProperties.map((property) => (
               <Link href={`/booking/${property.id}`} key={property.id} passHref>
                 <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow p-0">
                  <div className="flex flex-col md:flex-row shadow-none hover:shadow-none">
                    {/* Image */}
                    <div className="relative w-full md:w-72 h-52 md:h-auto flex-shrink-0">
                      <img
                        src={property.image}
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />
                      <Badge
                        variant="secondary"
                        className="absolute top-3 left-3 bg-gray-800/90 text-white hover:bg-gray-800"
                      >
                        {property.type}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-3 right-3 bg-white/90 hover:bg-white"
                        onClick={() => toggleFavorite(property.id)}
                      >
                        <Heart
                          className={`w-5 h-5 ${
                            favorites.has(property.id)
                              ? 'fill-red-500 text-red-500'
                              : 'text-gray-600'
                          }`}
                        />
                      </Button>
                    </div>

                    {/* Content */}
                    <CardContent className="flex-1 p-6 shadow-none hover:shadow-none">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between h-full">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-lg font-semibold">{property.title}</h3>
                            <div className="flex items-center gap-1 ml-4">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-medium">{property.rating}</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-3 flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {property.location} • {property.guests} guests
                          </p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {property.amenities.map((amenity, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {amenity}
                              </Badge>
                            ))}
                          </div>
                          {property.freeCancellation && (
                            <div className="space-y-1">
                              <p className="text-sm text-emerald-600 font-medium">
                                Free cancellation
                              </p>
                              <p className="text-xs text-gray-500">No prepayment needed</p>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col items-end mt-4 md:mt-0 md:ml-6">
                          <div className="text-right">
                            <div className="text-2xl font-bold">${property.price}</div>
                            <div className="text-xs text-gray-500">Total with taxes</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Card>
                </Link>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}