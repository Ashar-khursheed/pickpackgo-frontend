import Link from "next/link";
import React from "react";

interface DestinationCardProps {
  image: string;
  city: string;
  country: string;
  propertyCount: number;
  isTopRated?: boolean;
  id: number;
}

const DestinationCard: React.FC<DestinationCardProps> = ({
  image,
  city,
  country,
  propertyCount,
  isTopRated = false,
  id
}) => {
  return (
   <>
   <Link href={`/booking`} passHref>
    <div className="group relative w-full max-w-md 2xl:h-[600px] md:h-[400px] h-[250px] rounded-3xl overflow-hidden cursor-pointer shadow-xl hover:shadow-2xl transition-shadow duration-300">
      {/* Background Image with Zoom Effect */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
        style={{ backgroundImage: `url(${image})` }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />

      {/* Content */}
      <div className="relative h-full flex flex-col justify-between p-6">
        {/* Top Rated Badge */}
        {/* {isTopRated && (
          <div className="self-start">
            <span className="inline-block px-4 py-2 bg-orange-500 text-white text-sm font-semibold rounded-full uppercase tracking-wide">
              Top Rated
            </span>
          </div>
        )} */}
        <div className={`${isTopRated ? "self-start" : "invisible"}`}>
          <span className="inline-block 2xl:px-4 2xl:py-2 px-3 py-1 bg-orange-500 text-white text-[10px] 2xl:text-sm font-semibold rounded-full uppercase tracking-wide">
            Top Rated
          </span>
        </div>
        {/* Bottom Content */}
        <div className="space-y-3">
          <h2 className="text-white 2xl:text-4xl md:text-2xl text-lg font-bold tracking-tight">
            {city}, {country}
          </h2>

          <div className="inline-block">
            <span className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white text-sm font-medium rounded-full">
              {propertyCount.toLocaleString()} properties
            </span>
          </div>
        </div>
      </div>
    </div>
    </Link> 
    </>
  );
};

export default DestinationCard;
