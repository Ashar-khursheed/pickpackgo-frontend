'use client';

import { useState } from 'react';
import {
  Star, Calendar, Users, ShieldCheck,
  Loader2, CheckCircle2, XCircle, Baby,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE!;

interface Props {
  propertyId: number;
  price: number | null;
  currency: string;
  rating: number | null;
  ratingCount: number;
}

interface Availability {
  available: boolean;
  message: string;
}

export default function BookingCard({ propertyId, price, currency, rating, ratingCount }: Props) {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  const [isChecking, setIsChecking] = useState(false);
  const [availability, setAvailability] = useState<Availability | null>(null);

  const nights = (() => {
    if (!checkIn || !checkOut) return 0;
    const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
    return Math.max(0, Math.round(diff / (1000 * 60 * 60 * 24)));
  })();

  const subtotal = price && nights > 0 ? price * nights : null;
  const cleaningFee = 50;
  const serviceFee = 45;
  const total = subtotal ? subtotal + cleaningFee + serviceFee : null;

  // Reset availability when any input changes
  const resetAvailability = () => setAvailability(null);

  async function checkAvailability() {
    if (!checkIn || !checkOut) return;
    setIsChecking(true);
    setAvailability(null);
    try {
      const res = await fetch(
        `${API_BASE}/public/properties/${propertyId}/check-availability`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            check_in: checkIn,
            check_out: checkOut,
            adults,
            children,
          }),
        }
      );
      const json = await res.json();
      setAvailability({
        available: json.available ?? false,
        message: json.message ?? (json.available ? 'Property is available' : 'Not available'),
      });
    } catch {
      setAvailability({ available: false, message: 'Could not check availability. Please try again.' });
    } finally {
      setIsChecking(false);
    }
  }

  const canCheck = checkIn && checkOut && nights > 0;

  return (
    <div className="sticky top-32">
      <Card className="shadow-xl border-2">
        <CardContent className="p-6 space-y-5">

          {/* Price + Rating */}
          <div className="flex items-baseline gap-2">
            {price ? (
              <>
                <span className="text-3xl font-bold text-[#0d1637]">
                  ${price.toLocaleString()}
                </span>
                <span className="text-gray-500 text-sm">/ night</span>
              </>
            ) : (
              <span className="text-lg font-semibold text-gray-600">Contact for pricing</span>
            )}
            {rating !== null && (
              <div className="ml-auto flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold text-sm">{rating.toFixed(1)}</span>
                {ratingCount > 0 && (
                  <span className="text-xs text-gray-400">({ratingCount})</span>
                )}
              </div>
            )}
          </div>

          <Separator />

          {/* Dates */}
          <div className="grid grid-cols-2 gap-2">
            <div className="border border-gray-200 rounded-lg p-3">
              <label className="text-xs font-semibold text-gray-700 uppercase block mb-1">
                Check-in
              </label>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
                <input
                  type="date"
                  value={checkIn}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => { setCheckIn(e.target.value); resetAvailability(); }}
                  className="w-full text-sm focus:outline-none text-gray-700 bg-transparent"
                />
              </div>
            </div>
            <div className="border border-gray-200 rounded-lg p-3">
              <label className="text-xs font-semibold text-gray-700 uppercase block mb-1">
                Check-out
              </label>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
                <input
                  type="date"
                  value={checkOut}
                  min={checkIn || new Date().toISOString().split('T')[0]}
                  onChange={(e) => { setCheckOut(e.target.value); resetAvailability(); }}
                  className="w-full text-sm focus:outline-none text-gray-700 bg-transparent"
                />
              </div>
            </div>
          </div>

          {/* Adults + Children */}
          <div className="grid grid-cols-2 gap-2">
            <div className="border border-gray-200 rounded-lg p-3">
              <label className="text-xs font-semibold text-gray-700 uppercase block mb-1">
                Adults
              </label>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-400 shrink-0" />
                <input
                  type="number"
                  value={adults}
                  min="1"
                  onChange={(e) => { setAdults(Math.max(1, parseInt(e.target.value) || 1)); resetAvailability(); }}
                  className="w-full text-sm focus:outline-none text-gray-700 bg-transparent"
                />
              </div>
            </div>
            <div className="border border-gray-200 rounded-lg p-3">
              <label className="text-xs font-semibold text-gray-700 uppercase block mb-1">
                Children
              </label>
              <div className="flex items-center gap-2">
                <Baby className="w-4 h-4 text-gray-400 shrink-0" />
                <input
                  type="number"
                  value={children}
                  min="0"
                  onChange={(e) => { setChildren(Math.max(0, parseInt(e.target.value) || 0)); resetAvailability(); }}
                  className="w-full text-sm focus:outline-none text-gray-700 bg-transparent"
                />
              </div>
            </div>
          </div>

          {/* Check Availability button */}
          <Button
            type="button"
            onClick={checkAvailability}
            disabled={!canCheck || isChecking}
            className="w-full h-11 text-sm font-semibold bg-[#0d1637] hover:bg-[#1a2755] text-white disabled:opacity-50"
          >
            {isChecking ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Checking availability...
              </span>
            ) : (
              'Check Availability'
            )}
          </Button>

          {/* Availability message */}
          {availability && (
            <div
              className={`flex items-start gap-3 rounded-xl px-4 py-3 text-sm font-medium border ${
                availability.available
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}
            >
              {availability.available ? (
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-600" />
              ) : (
                <XCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-500" />
              )}
              <span>{availability.message}</span>
            </div>
          )}

          {/* Reserve — only active when available */}
          <Button
            disabled={availability?.available !== true}
            className="w-full h-12 text-base font-semibold bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-40"
          >
            Reserve
          </Button>

          <p className="text-center text-sm text-gray-500">You won't be charged yet</p>

          {/* Price breakdown */}
          {subtotal && (
            <>
              <Separator />
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-700">
                  <span>
                    ${price?.toLocaleString()} × {nights} night{nights !== 1 ? 's' : ''}
                  </span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Cleaning fee</span>
                  <span>${cleaningFee}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Service fee</span>
                  <span>${serviceFee}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-gray-900">
                  <span>Total before taxes</span>
                  <span>${total?.toLocaleString()}</span>
                </div>
                {currency && currency !== 'USD' && (
                  <p className="text-xs text-gray-400 text-center">Prices in {currency}</p>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <div className="mt-4 p-4 bg-emerald-50 rounded-lg border border-emerald-100">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
          <div>
            <h3 className="font-semibold text-emerald-900 text-sm mb-1">Safe & Secure Booking</h3>
            <p className="text-xs text-emerald-700">
              Your payment information is protected with bank-level encryption
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
