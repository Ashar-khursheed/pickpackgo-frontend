'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/layouts/header';
import SearchBar from '@/components/search-bar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Car, Fuel, Milestone, ShieldCheck, Gauge, ArrowRight } from 'lucide-react';
import makeApiRequest from '@/network-request/axios';
import { apiurl } from '@/network-request/apis';
import { notify } from '@/utils';

interface CarRental {
  id: number;
  rental_company: string;
  car_model: string;
  car_class: string;
  transmission: string;
  fuel_type: string;
  price_per_day: number;
  currency: string;
  image_url?: string;
  passengers?: number;
  large_bags?: number;
}

function CarsContent() {
  const searchParams = useSearchParams();
  const [cars, setCars] = useState<CarRental[]>([]);
  const [loading, setLoading] = useState(false);
  const [bookingCar, setBookingCar] = useState<CarRental | null>(null);
  
  // Driver Form
  const [driverForm, setDriverForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    license_number: '',
    phone: '',
  });
  const [bookingPending, setBookingPending] = useState(false);

  const location = searchParams.get('location') ?? '';
  const checkIn = searchParams.get('checkIn') ?? '';
  const checkOut = searchParams.get('checkOut') ?? '';

  const searchCars = async () => {
    setLoading(true);
    try {
      const res = await makeApiRequest(`${apiurl.carsSearch}?location=${encodeURIComponent(location)}&pickup_date=${checkIn}&dropoff_date=${checkOut}`);
      if (res.success) {
        setCars(res.data);
      } else {
        setCars([]);
      }
    } catch {
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location) {
      searchCars();
    }
  }, [location, checkIn, checkOut]);

  const handleBookCar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!driverForm.first_name || !driverForm.last_name || !driverForm.email || !driverForm.license_number) {
      notify({ message: 'Please fill all driver details', type: 'error' });
      return;
    }

    setBookingPending(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        notify({ message: 'Please login to complete your booking', type: 'error' });
        return;
      }

      const res = await makeApiRequest(apiurl.carsBook, {
        method: 'POST',
        data: {
          car_id: bookingCar?.id,
          driver_details: driverForm,
        },
      });

      if (res.success) {
        notify({ message: 'Car rental booked successfully!', type: 'success' });
        setBookingCar(null);
      }
    } catch {
      // Handled by axios notify interceptor
    } finally {
      setBookingPending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <Header />
      
      {/* Search Header */}
      <div className="bg-[#0d1637] py-6">
        <SearchBar
          initialLocation={location}
          initialCheckIn={checkIn}
          initialCheckOut={checkOut}
        />
      </div>

      <main className="global-container px-4 py-8 max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Car className="w-6 h-6 text-emerald-600" />
          <h1 className="text-2xl font-bold text-gray-900">Available Car Rentals</h1>
          {location && (
            <span className="text-sm text-gray-500 bg-gray-200 px-3 py-1 rounded-full">
              In {location}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Car list */}
          <div className="lg:col-span-2 space-y-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100">
                <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-3" />
                <p className="text-gray-500 text-sm">Searching for available cars...</p>
              </div>
            ) : cars.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 p-6">
                <Car className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-700 font-semibold mb-1">No cars found</p>
                <p className="text-gray-400 text-sm">Try searching for a different location or date range</p>
              </div>
            ) : (
              cars.map((car) => (
                <div 
                  key={car.id}
                  className={`bg-white rounded-2xl border transition-all p-6 ${
                    bookingCar?.id === car.id ? 'border-emerald-600 ring-2 ring-emerald-50' : 'border-gray-100 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start justify-between border-b border-gray-100 pb-4 mb-4">
                    <div>
                      <h4 className="font-bold text-lg text-gray-900">{car.car_model}</h4>
                      <p className="text-xs text-gray-500 font-medium">Provided by: {car.rental_company}</p>
                    </div>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full uppercase">
                      {car.car_class}
                    </span>
                  </div>

                  {/* Car Features grid */}
                  <div className="grid grid-cols-3 gap-4 my-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Fuel className="w-4 h-4 text-gray-400" />
                      <span>{car.fuel_type}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Gauge className="w-4 h-4 text-gray-400" />
                      <span>{car.transmission}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Milestone className="w-4 h-4 text-gray-400" />
                      <span>Unlimited mileage</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                    <div>
                      <span className="text-xs text-gray-400 block">Price per day</span>
                      <span className="text-xl font-bold text-gray-900">
                        ${Number(car.price_per_day).toFixed(2)}
                      </span>
                    </div>
                    <Button 
                      onClick={() => setBookingCar(car)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6"
                    >
                      Select Car <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Booking Side Panel */}
          <div>
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-6">
              {bookingCar ? (
                <form onSubmit={handleBookCar} className="space-y-4">
                  <h3 className="font-bold text-lg text-gray-900 mb-2">Driver Details</h3>
                  
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-2 mb-4 text-xs">
                    <p className="font-semibold text-gray-800">Selected Car:</p>
                    <div className="flex justify-between">
                      <span className="text-gray-500">{bookingCar.car_model}</span>
                      <span className="font-bold text-gray-900">${Number(bookingCar.price_per_day).toFixed(2)}/day</span>
                    </div>
                    <p className="text-gray-400 uppercase text-[10px] font-semibold">{bookingCar.rental_company} · {bookingCar.car_class}</p>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                      id="first_name"
                      placeholder="As in Driving License"
                      value={driverForm.first_name}
                      onChange={(e) => setDriverForm({ ...driverForm, first_name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                      id="last_name"
                      placeholder="As in Driving License"
                      value={driverForm.last_name}
                      onChange={(e) => setDriverForm({ ...driverForm, last_name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={driverForm.email}
                      onChange={(e) => setDriverForm({ ...driverForm, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="license_number">Driving License Number</Label>
                    <Input
                      id="license_number"
                      placeholder="DL-XXXXXXX"
                      value={driverForm.license_number}
                      onChange={(e) => setDriverForm({ ...driverForm, license_number: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      placeholder="+1 555 000 0000"
                      value={driverForm.phone}
                      onChange={(e) => setDriverForm({ ...driverForm, phone: e.target.value })}
                      required
                    />
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-500 py-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Driver must present physical license at pick-up.</span>
                  </div>

                  <Button 
                    type="submit"
                    disabled={bookingPending}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 cursor-pointer"
                  >
                    {bookingPending ? 'Processing Booking...' : 'Confirm Car Rental'}
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    onClick={() => setBookingCar(null)}
                    className="w-full text-gray-500 hover:bg-gray-50"
                  >
                    Cancel Selection
                  </Button>
                </form>
              ) : (
                <div className="text-center py-12">
                  <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Car className="w-6 h-6 text-gray-400" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">No Car Selected</h4>
                  <p className="text-gray-400 text-sm">Select a car model to check specifications, enter details and book.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function CarsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <CarsContent />
    </Suspense>
  );
}
