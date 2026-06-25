'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/layouts/header';
import SearchBar from '@/components/search-bar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Star, Clock, MapPin, Compass, ShieldCheck, Tag, Plus, Minus, ArrowRight } from 'lucide-react';
import makeApiRequest from '@/network-request/axios';
import { apiurl } from '@/network-request/apis';
import { notify } from '@/utils';

interface Experience {
  id: number;
  title: string;
  location: string;
  category: string;
  duration: string;
  price: number;
  currency: string;
  rating_average?: string;
  rating_count?: number;
  description?: string;
  image_url?: string;
}

function ExperiencesContent() {
  const searchParams = useSearchParams();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(false);
  const [bookingExp, setBookingExp] = useState<Experience | null>(null);
  
  // Booking parameters
  const [ticketCount, setTicketCount] = useState(1);
  const [bookingForm, setBookingForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    booking_date: '',
  });
  const [bookingPending, setBookingPending] = useState(false);

  const location = searchParams.get('location') ?? '';
  const checkIn = searchParams.get('checkIn') ?? '';

  const searchExperiences = async () => {
    setLoading(true);
    try {
      const res = await makeApiRequest(`${apiurl.experiencesSearch}?location=${encodeURIComponent(location)}&date=${checkIn}`);
      if (res.success) {
        setExperiences(res.data);
      } else {
        setExperiences([]);
      }
    } catch {
      setExperiences([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location) {
      searchExperiences();
    }
  }, [location, checkIn]);

  const handleBookExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingForm.first_name || !bookingForm.last_name || !bookingForm.email || !bookingForm.booking_date) {
      notify({ message: 'Please fill all ticket details', type: 'error' });
      return;
    }

    setBookingPending(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        notify({ message: 'Please login to complete your booking', type: 'error' });
        return;
      }

      const res = await makeApiRequest(apiurl.experiencesBook, {
        method: 'POST',
        data: {
          experience_id: bookingExp?.id,
          ticket_count: ticketCount,
          booking_details: bookingForm,
        },
      });

      if (res.success) {
        notify({ message: 'Experience tickets booked successfully!', type: 'success' });
        setBookingExp(null);
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
          <Compass className="w-6 h-6 text-emerald-600" />
          <h1 className="text-2xl font-bold text-gray-900">Recommended Experiences</h1>
          {location && (
            <span className="text-sm text-gray-500 bg-gray-200 px-3 py-1 rounded-full">
              In {location}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Experience list */}
          <div className="lg:col-span-2 space-y-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100">
                <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-3" />
                <p className="text-gray-500 text-sm">Finding awesome tours & activities...</p>
              </div>
            ) : experiences.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 p-6">
                <Compass className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-700 font-semibold mb-1">No experiences found</p>
                <p className="text-gray-400 text-sm">Try searching for a different destination or check later</p>
              </div>
            ) : (
              experiences.map((exp) => (
                <div 
                  key={exp.id}
                  className={`bg-white rounded-2xl border transition-all p-6 ${
                    bookingExp?.id === exp.id ? 'border-emerald-600 ring-2 ring-emerald-50' : 'border-gray-100 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start justify-between border-b border-gray-100 pb-4 mb-4">
                    <div>
                      <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider block mb-1">
                        {exp.category}
                      </span>
                      <h4 className="font-bold text-lg text-gray-900 leading-tight">{exp.title}</h4>
                    </div>
                  </div>

                  <p className="text-sm text-gray-500 font-light mb-6 line-clamp-2">
                    {exp.description || 'Embark on a fascinating journey to explore the most magnificent spots, learn local legends, and enjoy authentic flavors.'}
                  </p>

                  <div className="flex items-center gap-6 my-4 text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>{exp.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>{exp.location}</span>
                    </div>
                    {exp.rating_average && (
                      <div className="flex items-center gap-1 text-amber-500 font-medium">
                        <Star className="w-4 h-4 fill-amber-500" />
                        <span>{exp.rating_average} ({exp.rating_count ?? 12} reviews)</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                    <div>
                      <span className="text-xs text-gray-400 block">Tickets from</span>
                      <span className="text-xl font-bold text-gray-900">
                        ${Number(exp.price).toFixed(2)}
                      </span>
                    </div>
                    <Button 
                      onClick={() => setBookingExp(exp)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6"
                    >
                      Book Tickets <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Booking Side Panel */}
          <div>
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-6">
              {bookingExp ? (
                <form onSubmit={handleBookExperience} className="space-y-4">
                  <h3 className="font-bold text-lg text-gray-900 mb-2">Book Experience</h3>
                  
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-2 mb-4 text-xs">
                    <p className="font-semibold text-gray-800">Selected Experience:</p>
                    <p className="text-gray-600 font-medium">{bookingExp.title}</p>
                    <div className="flex justify-between border-t border-gray-200/60 pt-2 mt-2">
                      <span className="text-gray-500">Price per ticket:</span>
                      <span className="font-bold text-gray-900">${Number(bookingExp.price).toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Ticket selector */}
                  <div className="space-y-2">
                    <Label>Number of Tickets</Label>
                    <div className="flex items-center justify-between border border-gray-200 rounded-xl p-3 bg-white">
                      <span className="text-sm font-medium text-gray-700">Guests / Tickets</span>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-emerald-500 transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-6 text-center font-semibold text-gray-900">{ticketCount}</span>
                        <button
                          type="button"
                          onClick={() => setTicketCount(ticketCount + 1)}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-emerald-500 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="first_name">Contact First Name</Label>
                    <Input
                      id="first_name"
                      placeholder="First Name"
                      value={bookingForm.first_name}
                      onChange={(e) => setBookingForm({ ...bookingForm, first_name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="last_name">Contact Last Name</Label>
                    <Input
                      id="last_name"
                      placeholder="Last Name"
                      value={bookingForm.last_name}
                      onChange={(e) => setBookingForm({ ...bookingForm, last_name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={bookingForm.email}
                      onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      placeholder="+1 555 000 0000"
                      value={bookingForm.phone}
                      onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1.5 font-sans">
                    <Label htmlFor="booking_date">Select Date</Label>
                    <Input
                      id="booking_date"
                      type="date"
                      value={bookingForm.booking_date}
                      onChange={(e) => setBookingForm({ ...bookingForm, booking_date: e.target.value })}
                      required
                    />
                  </div>

                  <div className="border-t border-gray-100 pt-4 mt-2">
                    <div className="flex justify-between items-center text-sm font-bold text-gray-900">
                      <span>Total Amount:</span>
                      <span className="text-lg">${(bookingExp.price * ticketCount).toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-500 py-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Instant confirmation tickets delivered to email.</span>
                  </div>

                  <Button 
                    type="submit"
                    disabled={bookingPending}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 cursor-pointer"
                  >
                    {bookingPending ? 'Processing Booking...' : 'Confirm Tickets Booking'}
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    onClick={() => setBookingExp(null)}
                    className="w-full text-gray-500 hover:bg-gray-50"
                  >
                    Cancel Selection
                  </Button>
                </form>
              ) : (
                <div className="text-center py-12">
                  <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Compass className="w-6 h-6 text-gray-400" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">No Activity Selected</h4>
                  <p className="text-gray-400 text-sm">Select an experience card from the list to book tickets.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ExperiencesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ExperiencesContent />
    </Suspense>
  );
}
