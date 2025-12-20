import React from "react";

interface VacationCardProps {
  image: string;
  title: string;
  location: string;
  distance: string;
  price: number;
  type: "HOTEL" | "ENTIRE CONDO" | "APARTMENT" | "VILLA";
  badge?: string;
}

const VacationCard: React.FC<VacationCardProps> = ({
  image,
  title,
  location,
  distance,
  price,
  type,
  badge,
}) => {
  return (
    <div className="group w-full max-w-[650px] cursor-pointer bg-white rounded-xl">
      {/* Image Container */}
      <div className="relative h-64 rounded-2xl overflow-hidden mb-4">
        {/* Image with Zoom Effect */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
          style={{ backgroundImage: `url(${image})` }}
        />

        {/* Overlay on Hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

        {/* Top Badge (More Space) */}
        {badge && (
          <div className="absolute top-4 left-[57px] -translate-x-1/2">
            <span className="px-4 py-1.5 bg-orange-500 text-white text-xs font-semibold rounded-full shadow-lg">
              {badge}
            </span>
          </div>
        )}

        {/* Property Type Badge */}
        <div className="absolute top-4 right-4">
          <span className="px-4 py-1.5 bg-white text-gray-900 text-xs font-semibold rounded-full shadow-md">
            {type}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 ">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors">
            {title}
          </h3>
          <div className="flex items-baseline ml-4 flex-shrink-0">
            <span className="text-2xl font-bold text-green-600">${price}</span>
            <span className="text-sm text-gray-500 ml-1">/ night</span>
          </div>
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <span>{location}</span>
          <span className="mx-2">•</span>
          <span>{distance}</span>
        </div>
      </div>
    </div>
  );
};

export default VacationCard;
