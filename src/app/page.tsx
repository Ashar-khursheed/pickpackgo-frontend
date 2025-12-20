"use client";
import Container from "@/assets/home/Container.svg";
import DestinationCard from "@/components/destination-card";
import SearchBar from "@/components/search-bar";
import { Button } from "@/components/ui/button";
import VacationCard from "@/components/vacation-card";
import Header from "@/layouts/header";
import {
  AIICon,
  AirPlane,
  BotA,
  RewardIcon,
  RightIcon,
  RightIconGreen,
} from "@/utils/icon";
import { destinations, vacationRentals } from "@/utils/mock-data";
import Image from "next/image";
import BackgroundShasow from "@/assets/home/Background+Shadow.png";
import panelimg from "@/assets/home/panelimg.png";
export default function Home() {
  return (
    <>
      <main className="relative w-full min-h-screen overflow-hidden">
        <div className="relative">
          <Image
            src={Container}
            alt="PikPakGo Logo"
            className="w-full h-auto"
          />

          <div className="absolute inset-0 bg-black opacity-30"></div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full">
          <Header />
          <div className="global-container">
            <div className="relative z-10 flex h-[80vh] items-center justify-center w-full">
              <div>
                <h1 className="text-white font-bold text-6xl text-center">
                  Hotels, Rentals & Experiences.{" "}
                  <span className="block text-[#DBEAFE]"> In One Place.</span>
                </h1>
                <p className="mt-6 text-white text-center text-lg">
                  Discover the world's best stays and activities with our
                  unified travel marketplace.
                </p>

                <div className="flex items-center justify-center px-4 mt-11">
                  <SearchBar />
                </div>

                <div className="flex items-center justify-center gap-2.5 text-white border border-white/30 rounded-full p-2 w-[470px] mx-auto backdrop-blur-md bg-white/10">
                  <AIICon />
                  Use AI Trip Planner <RightIcon /> Get personalized itineraries
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <section className="py-20 bg-white">
        <div className="global-container">
          <div className="grid md:grid-cols-2 grid-cols-1 gap-4 items-center justify-between">
            <div className="">
              <h2 className="text-[#0F172A] md:text-3xl text-xl font-extrabold">
                Top Destinations for 2026
              </h2>
              <p className="text-[#64748B] md:text-xl text-base font-light mt-3">
                Curated getaways for your next adventure. Explore the world's
                most stunning locations with exclusive PikPakGo deals.
              </p>
            </div>
            <div className="text-right">
              <p className="flex gap-2.5 justify-end items-center text-[#16A34A] font-bold md:text-xl text-base">
                {" "}
                View all destinations
                <RightIconGreen />
              </p>
            </div>
          </div>

          <div className="mt-7">
            <div className="grid md:grid-cols-4 grid-cols-1 gap-6 items-center justify-between">
              {destinations?.map((destination, index) => {
                return (
                  <div>
                    <DestinationCard
                      image={destination.image}
                      city={destination.city}
                      country={destination.country}
                      propertyCount={destination.propertyCount}
                      isTopRated={destination.isTopRated}
                    />
                  </div>
                );
              })}
            </div>
          </div>
          <div className="pt-30 md:text-center text-left">
            <div>
              <h2 className="text-[#0F172A] md:text-5xl font-bold text-xl">
                Travel Services
              </h2>
              <p className="text-[#475569] md:text-lg text-base font-light mt-4">
                We provide a complete ecosystem for your travel needs.
              </p>
            </div>

            <div>
              <div className="grid md:grid-cols-4 grid-cols-1 gap-8 items-center justify-between mt-10">
                <div className="bg-[#F1F5F9] rounded-2xl shadow-lgs px-6 py-14 text-center hover:shadow-2xl transition-shadow duration-300 flex flex-col items-center gap-3">
                  <div>
                    <AirPlane />
                  </div>
                  <h3 className="text-[##0F172A] font-semibold md:text-2xl text-xl">
                    Booking
                  </h3>

                  <p className="text-[#64748B] md:text-lg text-base font-light mt-2">
                    Best prices on global flights
                  </p>
                </div>
                <div className="bg-[#F1F5F9] rounded-2xl shadow-lgs px-6 py-14 text-center hover:shadow-2xl transition-shadow duration-300 flex flex-col items-center gap-3">
                  <div>
                    <AirPlane />
                  </div>
                  <h3 className="text-[##0F172A] font-semibold md:text-2xl text-xl">
                    Hotels & Stays
                  </h3>

                  <p className="text-[#64748B] md:text-lg text-base font-light mt-2">
                    Luxury to budget accommodations
                  </p>
                </div>
                <div className="bg-[#F1F5F9] rounded-2xl shadow-lgs px-6 py-14 text-center hover:shadow-2xl transition-shadow duration-300 flex flex-col items-center gap-3">
                  <div>
                    <AirPlane />
                  </div>
                  <h3 className="text-[##0F172A] font-semibold md:text-2xl text-xl">
                    Car Rentals
                  </h3>

                  <p className="text-[#64748B] md:text-lg text-base font-light mt-2">
                    Flexible pickup & drop-off
                  </p>
                </div>
                <div className="bg-[#F1F5F9] rounded-2xl shadow-lgs px-6 py-14 text-center hover:shadow-2xl transition-shadow duration-300 flex flex-col items-center gap-3">
                  <div>
                    <AirPlane />
                  </div>
                  <h3 className="text-[##0F172A] font-semibold md:text-2xl text-xl">
                    Experiences
                  </h3>

                  <p className="text-[#64748B] md:text-lg text-base font-light mt-2">
                    Tours, events & activities
                  </p>
                </div>
              </div>
            </div>

            <div>
              <Button className="mt-10 bg-white hover:bg-green-700 cursor-pointer text-black md:text-lg border border-[#CBD5E1] hover:text-white text-base font-medium px-10 py-6 rounded-md hover:shadow-xl transition-all duration-300">
                View All Services
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#F8FAFC]">
        <div className="global-container">
          <div className="grid md:grid-cols-1 grid-cols-1 gap-4 items-center justify-between">
            <div className="text-center">
              <h2 className="text-[#0F172A] md:text-3xl text-xl font-extrabold">
                Hotels + Vacation Rentals — Together in One Search
              </h2>
              <p className="text-[#64748B] md:text-xl text-base font-light mt-3">
                Compare before you book. See a luxury hotel and a private villa
                on the same map, with the same search.
              </p>
            </div>
          </div>

          <div className="mt-8">
            <div className="grid md:grid-cols-4 grid-cols-1 gap-8 items-center justify-between">
              {vacationRentals?.map((vacationRental, index) => {
                return (
                  <div>
                    <VacationCard
                      image={vacationRental.image}
                      title={vacationRental.title}
                      location={vacationRental.location}
                      distance={vacationRental.distance}
                      price={vacationRental.price}
                      type={
                        vacationRental.type as
                          | "HOTEL"
                          | "ENTIRE CONDO"
                          | "APARTMENT"
                          | "VILLA"
                      }
                      badge={vacationRental.badge}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
      <section className="py-20 bg-[#fff] relative">
        <div className="global-container relative">
          <div className="relative">
            <Image
              src={BackgroundShasow}
              alt="BackgroundShasow"
              className="w-full h-auto"
            />
          </div>
          <div className="absolute top-0 flex flex-col items-centers justify-center w-full h-full pl-30">
            <div className="flex gap-2.5 items-center">
              <BotA />
              <h2 className="text-white font-light md:text-lg text-base">
                PikPakGo Intelligence
              </h2>
            </div>

            <div className="py-3.5 pt-12">
              <h2 className="md:text-6xl text-xl text-white font-bold">
                Let AI plan your next trip in
                <span className="block">seconds.</span>
              </h2>
            </div>
            <div className="py-3.5">
              <p className="text-[#DBEAFE] md:text-xl text-base font-light">
                Tell us where you want to go and what you love — we’ll build
                <span className="block">
                  your stay and activities automatically.
                </span>
              </p>
            </div>
            <div className="py-3.5">
              <Button className="group bg-white hover:bg-white cursor-pointer text-[#16A34A] md:text-lg border border-[#CBD5E1] hover:text-[#16A34A] text-base font-medium h-[55px] rounded-md hover:shadow-xl transition-all duration-300">
                <span className="flex items-center gap-2.5 px-[30px]">
                  <span>Launch AI Trip Planner</span>
                  <RightIconGreen />
                </span>
              </Button>
            </div>
          </div>
        </div>
      </section>
      <section className="py-20 bg-[#fff] relative">
        <div className="global-container relative">
          <div className="grid grid-cols-1 justify-center items-center text-center">
            <h2 className="text-[#0F172A] md:text-3xl text-xl font-bold">
              Earn Rewards Every Time You Travel
            </h2>
            <p className="text-[#475569] md:text-xl text-base font-light mt-4">
              Join free and start earning credits on your first booking.
            </p>
          </div>

          <div className="grid md:grid-cols-5 grid-cols-2 gap-8 mt-10 items-center justify-between">
            <div></div>
            <div className="bg-[#FFEDD5] p-5 py-12 flex flex-col items-center justify-between gap-3.5 rounded-2xl">
              <RewardIcon color="#EA580C" />
              <h5 className="text-[#9A3412] md:text-xl text-base font-bold">
                Bronze
              </h5>
              <h2 className="text-[#9A3412] md:text-4xl text-base font-extrabold">
                3%
              </h2>
              <p className="text-[#9A3412] text-base font-light">
                Cash back on every eligible booking
              </p>
            </div>
            <div className="bg-[#E2E8F0] p-5 py-12 flex flex-col items-center justify-between gap-3.5 rounded-2xl">
              <RewardIcon color="#64748B" />
              <h5 className="text-[#1E293B] md:text-xl text-base font-bold">
                Silver
              </h5>
              <h2 className="text-[#1E293B] md:text-4xl text-base font-extrabold">
                8%
              </h2>
              <p className="text-[#1E293B] text-base font-light">
                Cash back on every eligible booking
              </p>
            </div>
            <div className="bg-[#FEF9C3] p-5 py-12 flex flex-col items-center justify-between gap-3.5 rounded-2xl">
              <RewardIcon color="#CA8A04" />
              <h5 className="text-[#854D0E] md:text-xl text-base font-bold">
                Gold
              </h5>
              <h2 className="text-[#854D0E] md:text-4xl text-base font-extrabold">
                13%
              </h2>
              <p className="text-[#854D0E] text-base font-light">
                Cash back on every eligible booking
              </p>
            </div>
            <div></div>
          </div>
          <div className="grid place-items-center">
            <Button className="mt-10 bg-white hover:bg-green-700 cursor-pointer text-black md:text-lg border border-[#CBD5E1] hover:text-white text-base font-medium px-10 py-6 rounded-md hover:shadow-xl transition-all duration-300">
              View All Services
            </Button>
          </div>
        </div>
      </section>
      <section className="py-28 bg-[#F8FAFC] relative">
        <div className="global-container relative">
          <div className="grid md:grid-cols-2 grid-cols-1  items-center justify-between">
            <div>
              <div className="self-start">
                <span className="inline-block px-4 py-1.5 bg-[#DBEAFE] text-[#1D4ED8] text-[12px] font-semibold rounded-full uppercase tracking-wide">
                  For Professionals
                </span>
              </div>
              <h2 className="text-[#0F172A] md:text-5xl text-xl font-bold py-5">
                Travel Agencies &
                <span className="block">Corporate Partners</span>
              </h2>
              <p className="text-[#475569] md:text-xl text-base font-light mt-4">
                Use PikPakGo’s inventory under your own brand. Access our white-
                <span className="block">
                  label portal to manage bookings, markups, and commissions in
                  one
                </span>
                <span className="block">dashboard.</span>
              </p>
              <div className="pt-8">
                <Button className="group bg-[#16A34A] hover:bg-white cursor-pointer text-[#fff] md:text-lg border border-[#16A34A] hover:text-[#16A34A] text-base font-medium h-[55px] rounded-md hover:shadow-xl transition-all duration-300">
                  Learn about White-Label Access
                </Button>
              </div>
            </div>
            <div>
              <Image
                src={panelimg}
                alt="Corporate Travel"
                className="w-full h-auto "
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
