'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/layouts/header';
import SearchBar from '@/components/search-bar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShieldCheck, Truck, Users, Briefcase, MapPin, Clock, ArrowRight } from 'lucide-react';
import makeApiRequest from '@/network-request/axios';
import { apiurl } from '@/network-request/apis';
import { notify } from '@/utils';

interface Transfer {
  id: number;
  provider: string;
  vehicle_type: string;
  max_passengers: number;
  max_luggage: number;
  price: number;
  currency: string;
  duration_minutes: number;
}

function TransfersContent() {
  const searchParams = useSearchParams();
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(false);
  const [bookingTransfer, setBookingTransfer] = useState<Transfer | null>(null);
  
  // Passenger Form
  const [passengerForm, setPassengerForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    flight_number: '',
    pickup_time: '',
  });
  const [bookingPending, setBookingPending] = useState(false);

  const location = searchParams.get('location') ?? '';
  const checkIn = searchParams.get('checkIn') ?? '';

  const searchTransfers = async () => {
    setLoading(true);
    try {
      const res = await makeApiRequest(`${apiurl.transfersSearch}?location=${encodeURIComponent(location)}&date=${checkIn}`);
      if (res.success) {
        setTransfers(res.data);
      } else {
        setTransfers([]);
      }
    } catch {
      setTransfers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location) {
      searchTransfers();
    }
  }, [location, checkIn]);

  const handleBookTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passengerForm.first_name || !passengerForm.last_name || !passengerForm.email || !passengerForm.pickup_time) {
      notify({ message: 'Please fill all pickup details', type: 'error' });
      return;
    }

    setBookingPending(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        notify({ message: 'Please login to complete your booking', type: 'error' });
        return;
      }

      const res = await makeApiRequest(apiurl.transfersBook, {
        method: 'POST',
        data: {
          transfer_id: bookingTransfer?.id,
          passenger_details: passengerForm,
        },
      });

      if (res.success) {
        notify({ message: 'Airport transfer booked successfully!', type: 'success' });
        setBookingTransfer(null);
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
          <Truck className="w-6 h-6 text-emerald-600" />
          <h1 className="text-2xl font-bold text-gray-900">Available Airport Transfers</h1>
          {location && (
            <span className="text-sm text-gray-500 bg-gray-200 px-3 py-1 rounded-full">
              In {location}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Transfer list */}
          <div className="lg:col-span-2 space-y-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100">
                <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-3" />
                <p className="text-gray-500 text-sm">Searching for local transfers...</p>
              </div>
            ) : transfers.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 p-6">
                <Truck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-700 font-semibold mb-1">No transfers found</p>
                <p className="text-gray-400 text-sm">Try searching for a different destination or check later</p>
              </div>
            ) : (
              transfers.map((trans) => (
                <div 
                  key={trans.id}
                  className={`bg-white rounded-2xl border transition-all p-6 ${
                    bookingTransfer?.id === trans.id ? 'border-emerald-600 ring-2 ring-emerald-50' : 'border-gray-100 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start justify-between border-b border-gray-100 pb-4 mb-4">
                    <div>
                      <h4 className="font-bold text-lg text-gray-900 capitalize">{trans.vehicle_type}</h4>
                      <p className="text-xs text-gray-500 font-medium">Provided by: {trans.provider}</p>
                    </div>
                  </div>

                  {/* Vehicle specs */}
                  <div className="grid grid-cols-3 gap-4 my-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span>Up to {trans.max_passengers} Passengers</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Briefcase className="w-4 h-4 text-gray-400" />
                      <span>{trans.max_luggage} Luggage Bags</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>{trans.duration_minutes} Mins Est.</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                    <div>
                      <span className="text-xs text-gray-400 block">One-way total</span>
                      <span className="text-xl font-bold text-gray-900">
                        ${Number(trans.price).toFixed(2)}
                      </span>
                    </div>
                    <Button 
                      onClick={() => setBookingTransfer(trans)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6"
                    >
                      Select Transfer <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Booking Side Panel */}
          <div>
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-6">
              {bookingTransfer ? (
                <form onSubmit={handleBookTransfer} className="space-y-4">
                  <h3 className="font-bold text-lg text-gray-900 mb-2">Transfer Pickup Details</h3>
                  
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-2 mb-4 text-xs">
                    <p className="font-semibold text-gray-800">Selected Transfer:</p>
                    <div className="flex justify-between">
                      <span className="text-gray-500 capitalize">{bookingTransfer.vehicle_type}</span>
                      <span className="font-bold text-gray-900">${Number(bookingTransfer.price).toFixed(2)}</span>
                    </div>
                    <p className="text-gray-400 uppercase text-[10px] font-semibold">{bookingTransfer.provider}</p>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="first_name">Passenger First Name</Label>
                    <Input
                      id="first_name"
                      placeholder="First Name"
                      value={passengerForm.first_name}
                      onChange={(e) => setPassengerForm({ ...passengerForm, first_name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="last_name">Passenger Last Name</Label>
                    <Input
                      id="last_name"
                      placeholder="Last Name"
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
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      placeholder="+1 555 000 0000"
                      value={passengerForm.phone}
                      onChange={(e) => setPassengerForm({ ...passengerForm, phone: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="flight_number">Arrival Flight Number (Optional)</Label>
                    <Input
                      id="flight_number"
                      placeholder="EK-203"
                      value={passengerForm.flight_number}
                      onChange={(e) => setPassengerForm({ ...passengerForm, flight_number: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="pickup_time">Pickup Time</Label>
                    <Input
                      id="pickup_time"
                      placeholder="14:30"
                      value={passengerForm.pickup_time}
                      onChange={(e) => setPassengerForm({ ...passengerForm, pickup_time: e.target.value })}
                      required
                    />
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-500 py-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Free meet & greet at arrivals hall included.</span>
                  </div>

                  <Button 
                    type="submit"
                    disabled={bookingPending}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 cursor-pointer"
                  >
                    {bookingPending ? 'Processing Booking...' : 'Confirm Transfer Booking'}
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    onClick={() => setBookingTransfer(null)}
                    className="w-full text-gray-500 hover:bg-gray-50"
                  >
                    Cancel Selection
                  </Button>
                </form>
              ) : (
                <div className="text-center py-12">
                  <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Truck className="w-6 h-6 text-gray-400" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">No Transfer Selected</h4>
                  <p className="text-gray-400 text-sm">Select a transfer vehicle from the list to book custom airport pickup.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function TransfersPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <TransfersContent />
    </Suspense>
  );
}
