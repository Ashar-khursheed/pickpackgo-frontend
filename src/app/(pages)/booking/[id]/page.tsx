'use client';

import { useState } from 'react';
import { 
  Heart, 
  Share2, 
  Star, 
  MapPin, 
  Wifi, 
  Dumbbell,
  UtensilsCrossed,
  Car,
  Waves,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Users,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import Header from '@/layouts/header';

interface PropertyDetailProps {
  property?: {
    id: string;
    title: string;
    rating: number;
    reviews: number;
    location: string;
    images: string[];
    price: number;
    description: string;
    amenities: Array<{
      icon: string;
      name: string;
    }>;
  };
}

const defaultProperty = {
  id: '1',
  title: 'Azure Bay Resort',
  rating: 4.8,
  reviews: 124,
  location: 'Malibu, California, USA',
  images: [
    'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  ],
  price: 240,
  description: 'Experience the ultimate coastal luxury at Azure Bay Resort. Perched on a cliff overlooking the Pacific Ocean, this resort offers breathtaking views, private beach access, and world-class amenities. Whether you\'re here for a romantic getaway or a family vacation, our attentive staff ensures an unforgettable stay.',
  amenities: [
    { icon: 'wifi', name: 'Free High-Speed WiFi' },
    { icon: 'beach', name: 'Private Beach Access' },
    { icon: 'restaurant', name: 'Fine Dining Restaurant' },
    { icon: 'gym', name: 'Fitness Center' },
    { icon: 'pool', name: 'Ocean View Pool' },
    { icon: 'spa', name: 'Spa & Wellness Center' },
    { icon: 'parking', name: 'Free Parking' },
    { icon: 'service', name: 'Room Service' },
  ],
};

const amenityIcons: Record<string, any> = {
  wifi: Wifi,
  beach: Waves,
  restaurant: UtensilsCrossed,
  gym: Dumbbell,
  pool: Waves,
  spa: ShieldCheck,
  parking: Car,
  service: ShieldCheck,
};

export default function PropertyDetail({ property = defaultProperty }: PropertyDetailProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [checkIn, setCheckIn] = useState('Oct 12');
  const [checkOut, setCheckOut] = useState('Oct 16');
  const [guests, setGuests] = useState(2);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  const calculateTotal = () => {
    const nights = 4;
    const subtotal = property.price * nights;
    const cleaningFee = 50;
    const serviceFee = 45;
    return {
      subtotal,
      cleaningFee,
      serviceFee,
      total: subtotal + cleaningFee + serviceFee,
      nights,
    };
  };

  const totals = calculateTotal();

  return (
   <>
   <Header/>
    <div className="min-h-screen bg-gray-50">
      {/* Image Gallery */}
      <div className="relative bg-black">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 max-h-[600px]">
            {/* Main Image */}
            <div 
              className="lg:col-span-2 lg:row-span-2 relative group cursor-pointer overflow-hidden rounded-lg"
              onClick={() => setIsImageModalOpen(true)}
            >
              <img
                src={property.images[currentImageIndex]}
                alt={property.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              
              {/* Navigation Arrows */}
              <button
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeft className="w-6 h-6 text-gray-800" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRight className="w-6 h-6 text-gray-800" />
              </button>
            </div>

            {/* Thumbnail Grid */}
            {property.images.slice(1, 5).map((image, index) => (
              <div
                key={index}
                className="relative group cursor-pointer overflow-hidden rounded-lg h-[145px] lg:h-auto"
                onClick={() => setCurrentImageIndex(index + 1)}
              >
                <img
                  src={image}
                  alt={`${property.title} ${index + 2}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                    {property.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-gray-900">{property.rating}</span>
                      <span>({property.reviews} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{property.location}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                    onClick={() => setIsSaved(!isSaved)}
                  >
                    <Heart
                      className={cn(
                        'w-5 h-5',
                        isSaved && 'fill-red-500 text-red-500'
                      )}
                    />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>

            <Separator />

            {/* About */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                About this place
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {property.description}
              </p>
            </div>

            <Separator />

            {/* Amenities */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                What this place offers
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {property.amenities.map((amenity, index) => {
                  const Icon = amenityIcons[amenity.icon] || Wifi;
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-3 text-gray-700"
                    >
                      <Icon className="w-5 h-5 text-gray-600" />
                      <span>{amenity.name}</span>
                    </div>
                  );
                })}
              </div>
              <Button variant="outline" className="mt-6">
                Show all amenities
              </Button>
            </div>

            <Separator />

            {/* Location */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Location
              </h2>
              <div className="bg-gray-200 rounded-lg h-[400px] flex items-center justify-center">
                <p className="text-gray-500">Interactive Map Placeholder</p>
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="shadow-xl border-2">
                <CardContent className="p-6 space-y-6">
                  {/* Price */}
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-gray-900">
                      ${property.price}
                    </span>
                    <span className="text-gray-600">/ night</span>
                    <div className="ml-auto flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{property.rating}</span>
                    </div>
                  </div>

                  <Separator />

                  {/* Date Selection */}
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="border-2 border-gray-200 rounded-lg p-3 hover:border-gray-400 transition-colors cursor-pointer">
                        <label className="text-xs font-semibold text-gray-900 uppercase">
                          Check-in
                        </label>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <input
                            type="text"
                            value={checkIn}
                            onChange={(e) => setCheckIn(e.target.value)}
                            className="w-full text-sm font-medium focus:outline-none"
                          />
                        </div>
                      </div>
                      <div className="border-2 border-gray-200 rounded-lg p-3 hover:border-gray-400 transition-colors cursor-pointer">
                        <label className="text-xs font-semibold text-gray-900 uppercase">
                          Check-out
                        </label>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <input
                            type="text"
                            value={checkOut}
                            onChange={(e) => setCheckOut(e.target.value)}
                            className="w-full text-sm font-medium focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="border-2 border-gray-200 rounded-lg p-3 hover:border-gray-400 transition-colors cursor-pointer">
                      <label className="text-xs font-semibold text-gray-900 uppercase">
                        Guests
                      </label>
                      <div className="flex items-center gap-2 mt-1">
                        <Users className="w-4 h-4 text-gray-500" />
                        <input
                          type="number"
                          value={guests}
                          onChange={(e) => setGuests(parseInt(e.target.value))}
                          className="w-full text-sm font-medium focus:outline-none"
                          min="1"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Reserve Button */}
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-12 text-base font-semibold shadow-lg shadow-emerald-600/20">
                    Reserve
                  </Button>

                  <p className="text-center text-sm text-gray-500">
                    You won't be charged yet
                  </p>

                  <Separator />

                  {/* Price Breakdown */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-gray-700">
                      <span className="underline">${property.price} x {totals.nights} nights</span>
                      <span>${totals.subtotal}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span className="underline">Cleaning fee</span>
                      <span>${totals.cleaningFee}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span className="underline">Service fee</span>
                      <span>${totals.serviceFee}</span>
                    </div>

                    <Separator />

                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>Total before taxes</span>
                      <span>${totals.total}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Trust Badge */}
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-1">
                      Safe & Secure Booking
                    </h3>
                    <p className="text-sm text-blue-700">
                      Your payment information is protected with bank-level encryption
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {isImageModalOpen && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <button
            onClick={() => setIsImageModalOpen(false)}
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          <div className="relative max-w-6xl w-full">
            <img
              src={property.images[currentImageIndex]}
              alt={property.title}
              className="w-full h-auto max-h-[90vh] object-contain rounded-lg"
            />
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg"
            >
              <ChevronLeft className="w-6 h-6 text-gray-800" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg"
            >
              <ChevronRight className="w-6 h-6 text-gray-800" />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {property.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={cn(
                    'w-2 h-2 rounded-full transition-all',
                    index === currentImageIndex
                      ? 'bg-white w-8'
                      : 'bg-white/50 hover:bg-white/75'
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div></>
  );
}