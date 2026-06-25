'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/layouts/header';
import SearchBar from '@/components/search-bar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plane, Calendar, User, ArrowRight, ShieldCheck, Ticket } from 'lucide-react';
import makeApiRequest from '@/network-request/axios';
import { apiurl } from '@/network-request/apis';
import { notify } from '@/utils';

interface Flight {
  id: number;
  airline: string;
  flight_number: string;
  departure_airport: string;
  arrival_airport: string;
  departure_time: string;
  arrival_time: string;
  price: number;
  currency: string;
  cabin_class: string;
  baggage_allowance?: string;
  stops?: number;
}

function FlightsContent() {
  const searchParams = useSearchParams();
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);
  const [bookingFlight, setBookingFlight] = useState<Flight | null>(null);
  
  // Passenger Form
  const [passengerForm, setPassengerForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    passport_number: '',
    date_of_birth: '',
  });
  const [bookingPending, setBookingPending] = useState(false);

  const location = searchParams.get('location') ?? '';
  const checkIn = searchParams.get('checkIn') ?? '';

  const searchFlights = async () => {
    setLoading(true);
    try {
      const res = await makeApiRequest(`${apiurl.flightsSearch}?location=${encodeURIComponent(location)}&date=${checkIn}`);
      if (res.success) {
        setFlights(res.data);
      } else {
        setFlights([]);
      }
    } catch {
      setFlights([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location) {
      searchFlights();
    }
  }, [location, checkIn]);

  const handleBookFlight = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passengerForm.first_name || !passengerForm.last_name || !passengerForm.email || !passengerForm.passport_number) {
      notify({ message: 'Please fill all passenger details', type: 'error' });
      return;
    }

    setBookingPending(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        notify({ message: 'Please login to complete your booking', type: 'error' });
        return;
      }

      const res = await makeApiRequest(apiurl.flightsBook, {
        method: 'POST',
        data: {
          flight_id: bookingFlight?.id,
          passenger_details: passengerForm,
        },
      });

      if (res.success) {
        notify({ message: 'Flight booked successfully!', type: 'success' });
        setBookingFlight(null);
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
        />
      </div>

      <main className="global-container px-4 py-8 max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Plane className="w-6 h-6 text-emerald-600" />
          <h1 className="text-2xl font-bold text-gray-900">Available Flights</h1>
          {location && (
            <span className="text-sm text-gray-500 bg-gray-200 px-3 py-1 rounded-full">
              To {location}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Flight list */}
          <div className="lg:col-span-2 space-y-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100">
                <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-3" />
                <p className="text-gray-500 text-sm">Searching for best flights...</p>
              </div>
            ) : flights.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 p-6">
                <Ticket className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-700 font-semibold mb-1">No flights found</p>
                <p className="text-gray-400 text-sm">Try searching for a different destination or date</p>
              </div>
            ) : (
              flights.map((flight) => (
                <div 
                  key={flight.id}
                  className={`bg-white rounded-2xl border transition-all p-6 ${
                    bookingFlight?.id === flight.id ? 'border-emerald-600 ring-2 ring-emerald-50' : 'border-gray-100 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
                        <Plane className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm">{flight.airline}</h4>
                        <p className="text-xs text-gray-400">Flight: {flight.flight_number}</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full uppercase">
                      {flight.cabin_class}
                    </span>
                  </div>

                  {/* Route & Times */}
                  <div className="flex items-center justify-between text-center mb-6">
                    <div className="text-left">
                      <p className="text-lg font-bold text-gray-900">
                        {new Date(flight.departure_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <p className="text-xs text-gray-500 font-medium">{flight.departure_airport}</p>
                    </div>

                    <div className="flex-1 px-6 relative flex flex-col items-center">
                      <span className="text-[10px] text-gray-400 font-medium mb-1">
                        {flight.stops === 0 ? 'Non-stop' : `${flight.stops} Stop(s)`}
                      </span>
                      <div className="w-full h-0.5 bg-gray-200 relative">
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      </div>
                      <span className="text-[10px] text-gray-400 font-medium mt-1">Direct Route</span>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        {new Date(flight.arrival_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <p className="text-xs text-gray-500 font-medium">{flight.arrival_airport}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                    <div>
                      <span className="text-xs text-gray-400 block">Total Price</span>
                      <span className="text-xl font-bold text-gray-900">
                        ${Number(flight.price).toFixed(2)}
                      </span>
                    </div>
                    <Button 
                      onClick={() => setBookingFlight(flight)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6"
                    >
                      Select Flight <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Booking Side Panel */}
          <div>
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-6">
              {bookingFlight ? (
                <form onSubmit={handleBookFlight} className="space-y-4">
                  <h3 className="font-bold text-lg text-gray-900 mb-2">Passenger Information</h3>
                  
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-2 mb-4 text-xs">
                    <p className="font-semibold text-gray-800">Selected Flight:</p>
                    <div className="flex justify-between">
                      <span className="text-gray-500">{bookingFlight.airline} {bookingFlight.flight_number}</span>
                      <span className="font-bold text-gray-900">${Number(bookingFlight.price).toFixed(2)}</span>
                    </div>
                    <p className="text-gray-400">
                      {bookingFlight.departure_airport} → {bookingFlight.arrival_airport}
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                      id="first_name"
                      placeholder="As in Passport"
                      value={passengerForm.first_name}
                      onChange={(e) => setPassengerForm({ ...passengerForm, first_name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                      id="last_name"
                      placeholder="As in Passport"
                      value={passengerForm.last_name}
                      onChange={(e) => setPassengerForm({ ...passengerForm, last_name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={passengerForm.email}
                      onChange={(e) => setPassengerForm({ ...passengerForm, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="passport_number">Passport Number</Label>
                    <Input
                      id="passport_number"
                      placeholder="GXXXXXXX"
                      value={passengerForm.passport_number}
                      onChange={(e) => setPassengerForm({ ...passengerForm, passport_number: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-1.5 font-sans">
                    <Label htmlFor="date_of_birth">Date of Birth</Label>
                    <Input
                      id="date_of_birth"
                      type="date"
                      value={passengerForm.date_of_birth}
                      onChange={(e) => setPassengerForm({ ...passengerForm, date_of_birth: e.target.value })}
                      required
                    />
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-500 py-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Your personal information is secure and encrypted.</span>
                  </div>

                  <Button 
                    type="submit"
                    disabled={bookingPending}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 cursor-pointer"
                  >
                    {bookingPending ? 'Processing Booking...' : 'Confirm Flight Booking'}
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    onClick={() => setBookingFlight(null)}
                    className="w-full text-gray-500 hover:bg-gray-50"
                  >
                    Cancel Selection
                  </Button>
                </form>
              ) : (
                <div className="text-center py-12">
                  <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <User className="w-6 h-6 text-gray-400" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">No Flight Selected</h4>
                  <p className="text-gray-400 text-sm">Select a flight from the list to enter passenger details and book.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function FlightsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <FlightsContent />
    </Suspense>
  );
}
