"use client";

import {
  Calendar,
  Car,
  Check,
  Hotel,
  MapPin,
  Plus,
  ShoppingCart,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import type React from "react";
import { Suspense, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/layouts/header";
import { apiurl } from "@/network-request/apis";
import makeApiRequest from "@/network-request/axios";
import { notify } from "@/utils";

interface ItineraryDay {
  day: number;
  date?: string;
  activities: {
    time: string;
    title: string;
    description: string;
    cost?: number;
    location?: string;
  }[];
}

interface GeneratedItinerary {
  id?: number;
  destination: string;
  duration_days: number;
  budget_level: string;
  estimated_cost: number;
  days: ItineraryDay[];
  accommodation?: {
    name: string;
    price: number;
    address: string;
  };
  transportation?: {
    type: string;
    price: number;
  };
}

function TripPlannerContent() {
  const router = useRouter();

  // Prompt State
  const [destination, setDestination] = useState("");
  const [days, setDays] = useState(3);
  const [budget, setBudget] = useState("moderate");
  const [specialRequests, setSpecialRequests] = useState("");
  const [interests, setInterests] = useState<string[]>(["sightseeing"]);

  const interestOptions = [
    { id: "sightseeing", label: "Sightseeing", icon: "🏛️" },
    { id: "adventure", label: "Adventure", icon: "⛰️" },
    { id: "food", label: "Food & Dining", icon: "🍽️" },
    { id: "nature", label: "Nature & Wildlife", icon: "🌿" },
    { id: "shopping", label: "Shopping", icon: "🛍️" },
    { id: "relaxation", label: "Relaxation", icon: "🏖️" },
  ];

  const toggleInterest = (id: string) => {
    setInterests((prev) => {
      const next = prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id];
      // Enforce at least one interest is selected
      return next.length === 0 ? ["sightseeing"] : next;
    });
  };

  // Output State
  const [generating, setGenerating] = useState(false);
  const [itinerary, setItinerary] = useState<GeneratedItinerary | null>(null);

  // Saved state
  const [savedItineraryId, setSavedItineraryId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);

  // Check login
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim()) {
      notify({ message: "Please enter a destination", type: "error" });
      return;
    }

    setGenerating(true);
    setItinerary(null);
    setSavedItineraryId(null);

    try {
      const res = await makeApiRequest(apiurl.tripPlannerGenerate, {
        method: "POST",
        data: {
          destination,
          days,
          budget_level: budget,
          special_requests: specialRequests,
          interests,
        },
      });

      if (res.success) {
        setItinerary(res.data);
        notify({
          message: "AI Trip Itinerary generated successfully!",
          type: "success",
        });
      }
    } catch {
      // handled by axial notify interceptor
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveItinerary = async () => {
    if (!itinerary) return;
    setSaving(true);
    try {
      const res = await makeApiRequest(apiurl.tripPlannerItineraries, {
        method: "POST",
        data: itinerary,
      });

      if (res.success) {
        setSavedItineraryId(res.data.id);
        notify({
          message: "Itinerary saved to your account!",
          type: "success",
        });
      }
    } catch {
      // handled
    } finally {
      setSaving(false);
    }
  };

  const handleCheckout = async () => {
    if (!savedItineraryId) {
      notify({
        message: "Please save the itinerary first to checkout",
        type: "error",
      });
      return;
    }

    setCheckingOut(true);
    try {
      const res = await makeApiRequest(
        apiurl.tripPlannerCheckout(savedItineraryId),
        {
          method: "POST",
        },
      );

      if (res.success) {
        notify({
          message: "Checkout successful! All services have been booked.",
          type: "success",
        });
        router.push("/dashboard?tab=bookings");
      }
    } catch {
      // handled
    } finally {
      setCheckingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <Header />

      {/* Premium Gradient Hero */}
      <div className="bg-linear-to-br from-[#0d1637] via-[#0b2545] to-[#134074] py-16 text-white text-center">
        <div className="global-container max-w-4xl px-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            AI Intelligence Powered
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Plan your next dream trip in{" "}
            <span className="text-emerald-400">seconds</span>
          </h1>
          <p className="text-blue-100 text-lg font-light max-w-2xl mx-auto">
            Input where you want to go, and let our custom AI build a completely
            unified travel itinerary matching your budget, accommodation, and
            flights.
          </p>
        </div>
      </div>

      <main className="global-container px-4 py-12 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Inputs Section */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs h-fit lg:sticky lg:top-6">
            <h3 className="font-bold text-xl text-gray-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              Customize Plan
            </h3>

            <form onSubmit={handleGenerate} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="destination" className="text-gray-700">
                  Where are you going?
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600" />
                  <Input
                    id="destination"
                    placeholder="e.g. Dubai, Tokyo, Paris"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="days" className="text-gray-700">
                    Duration (days)
                  </Label>
                  <Input
                    id="days"
                    type="number"
                    min={1}
                    max={14}
                    value={days}
                    onChange={(e) => setDays(parseInt(e.target.value, 10) || 3)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="budget" className="text-gray-700">
                    Budget Level
                  </Label>
                  <select
                    id="budget"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                  >
                    <option value="economy">Economy</option>
                    <option value="moderate">Moderate</option>
                    <option value="luxury">Luxury</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700 block">
                  Select Interests <span className="text-red-500">*</span>
                </Label>
                <div className="flex flex-wrap gap-2">
                  {interestOptions.map((opt) => {
                    const isSelected = interests.includes(opt.id);
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => toggleInterest(opt.id)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer flex items-center gap-1.5 border ${
                          isSelected
                            ? "bg-emerald-50 border-emerald-500 text-emerald-700"
                            : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                        }`}
                      >
                        <span>{opt.icon}</span>
                        <span>{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="requests" className="text-gray-700">
                  Special Preferences
                </Label>
                <Textarea
                  id="requests"
                  placeholder="e.g. Vegetarian food, family friendly, beach activities, skip museums..."
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  rows={3}
                />
              </div>

              <Button
                type="submit"
                disabled={generating}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-6 cursor-pointer rounded-xl"
              >
                {generating ? (
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Generating Itinerary...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Generate AI Itinerary
                  </span>
                )}
              </Button>
            </form>
          </div>

          {/* Output Itinerary Section */}
          <div className="lg:col-span-2">
            {generating ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-xs flex flex-col items-center justify-center min-h-[400px]">
                <div className="relative w-16 h-16 mb-4">
                  <div className="absolute inset-0 border-4 border-emerald-100 rounded-full" />
                  <div className="absolute inset-0 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                  <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-emerald-600 animate-pulse" />
                </div>
                <h4 className="font-bold text-lg text-gray-900 mb-1">
                  Creating Your Dream Adventure
                </h4>
                <p className="text-gray-400 text-sm max-w-sm">
                  We are consulting properties, flights, activities, and
                  transport guides to build a unified custom trip plan.
                </p>
              </div>
            ) : itinerary ? (
              <div className="space-y-6">
                {/* Header overview card */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4 mb-4">
                    <div>
                      <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider block mb-1">
                        Generated Plan
                      </span>
                      <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        {itinerary.destination}
                      </h2>
                      <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-1 font-sans">
                        <Calendar className="w-4 h-4 text-emerald-600" />
                        {itinerary.duration_days} Days · Budget:{" "}
                        <span className="font-semibold text-emerald-700 capitalize">
                          {itinerary.budget_level}
                        </span>
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-xs text-gray-400 block font-medium">
                        Estimated Package Cost
                      </span>
                      <span className="text-2xl font-extrabold text-emerald-600">
                        ${Number(itinerary.estimated_cost).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    {isLoggedIn ? (
                      savedItineraryId ? (
                        <>
                          <Button
                            disabled
                            className="bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200"
                          >
                            <Check className="w-4 h-4 mr-2" /> Saved to Account
                          </Button>
                          <Button
                            onClick={handleCheckout}
                            disabled={checkingOut}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer"
                          >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            {checkingOut
                              ? "Checking out..."
                              : "Checkout Unified Itinerary"}
                          </Button>
                        </>
                      ) : (
                        <Button
                          onClick={handleSaveItinerary}
                          disabled={saving}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          {saving ? "Saving..." : "Save Itinerary & Checkout"}
                        </Button>
                      )
                    ) : (
                      <div className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg p-3 w-full flex items-center justify-between">
                        <span>
                          Please log in to save this itinerary and purchase this
                          unified travel package.
                        </span>
                        <Button
                          size="sm"
                          onClick={() => router.push("/login")}
                          className="bg-amber-600 text-white hover:bg-amber-700 text-xs py-1 h-auto"
                        >
                          Log In
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Stays & Transportation Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {itinerary.accommodation && (
                    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs flex gap-4">
                      <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center shrink-0 text-emerald-600">
                        <Hotel className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-0.5">
                          Recommended Stay
                        </span>
                        <h4 className="font-bold text-gray-900 leading-tight">
                          {itinerary.accommodation.name}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {itinerary.accommodation.address}
                        </p>
                        <p className="text-sm font-semibold text-emerald-700 mt-2">
                          ${itinerary.accommodation.price}/night
                        </p>
                      </div>
                    </div>
                  )}

                  {itinerary.transportation && (
                    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs flex gap-4">
                      <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center shrink-0 text-emerald-600">
                        <Car className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-0.5">
                          Recommended Travel
                        </span>
                        <h4 className="font-bold text-gray-900 leading-tight capitalize">
                          {itinerary.transportation.type}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          Unified booking included in pricing plan.
                        </p>
                        <p className="text-sm font-semibold text-emerald-700 mt-2">
                          ${itinerary.transportation.price} Est.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Day-by-Day view */}
                <div className="space-y-4">
                  <h3 className="font-bold text-lg text-gray-900">
                    Day-by-Day Itinerary Schedule
                  </h3>

                  {itinerary.days.map((day) => (
                    <div
                      key={day.day}
                      className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs"
                    >
                      <div className="flex items-center gap-3 border-b border-gray-100 pb-3 mb-4">
                        <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-sm flex items-center justify-center">
                          {day.day}
                        </div>
                        <h4 className="font-bold text-gray-900 text-base">
                          Day {day.day} Schedule
                        </h4>
                      </div>

                      <div className="space-y-4">
                        {day.activities.map((act, actIdx) => (
                          <div
                            key={actIdx}
                            className="relative pl-6 border-l-2 border-emerald-500/20 last:border-0 pb-2"
                          >
                            <div className="absolute left-[-5px] top-1.5 w-2 h-2 rounded-full bg-emerald-600" />
                            <div className="flex justify-between items-start gap-4">
                              <div>
                                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md uppercase tracking-wider">
                                  {act.time}
                                </span>
                                <h5 className="font-semibold text-gray-900 mt-1.5">
                                  {act.title}
                                </h5>
                                <p className="text-xs text-gray-500 mt-1 leading-relaxed font-light">
                                  {act.description}
                                </p>
                                {act.location && (
                                  <span className="text-[10px] text-gray-400 flex items-center gap-1 mt-1 font-medium">
                                    <MapPin className="w-3 h-3 text-emerald-600" />{" "}
                                    {act.location}
                                  </span>
                                )}
                              </div>
                              {act.cost !== undefined && (
                                <span className="text-sm font-semibold text-gray-900 shrink-0">
                                  {act.cost === 0 ? "Free" : `$${act.cost}`}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-xs flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-lg text-gray-900 mb-1">
                  AI Trip Planner Output
                </h4>
                <p className="text-gray-400 text-sm max-w-sm">
                  Use the left panel to configure your destination, duration and
                  budget, then click Generate to construct an itinerary.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function TripPlannerPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <TripPlannerContent />
    </Suspense>
  );
}
