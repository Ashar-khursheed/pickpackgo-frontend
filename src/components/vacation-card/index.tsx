"use client";
import { Star } from "lucide-react";
import type React from "react";
import WishlistButton from "@/components/wishlist-button";

interface VacationCardProps {
  image: string;
  title: string;
  location: string;
  distance: string;
  price: number;
  type: "HOTEL" | "ENTIRE CONDO" | "APARTMENT" | "VILLA";
  badge?: string;
  rating?: number;
  reviewCount?: number;
  freeCancellation?: boolean;
  propertyCode?: string;
  propertyType?: string;
  currency?: string;
  seoSlug?: string;
}

const VacationCard: React.FC<VacationCardProps> = ({
  image,
  title,
  location,
  distance,
  price,
  type,
  badge,
  rating,
  reviewCount,
  freeCancellation,
  propertyCode,
  propertyType,
  currency = "USD",
  seoSlug,
}) => {
  return (
    <div className="group w-full max-w-162.5 cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="relative h-64 rounded-2xl overflow-hidden mb-4">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
          style={{ backgroundImage: `url(${image})` }}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-300" />

        {/* Wishlist button */}
        {propertyCode && (
          <WishlistButton
            propertyCode={propertyCode}
            propertyName={title}
            propertyType={propertyType ?? type}
            pricePerNight={price}
            currency={currency}
            imageUrl={image}
            seoSlug={seoSlug}
            className="absolute top-3 right-3 z-10"
          />
        )}

        {badge && (
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 bg-orange-500 text-white text-xs font-semibold rounded-full shadow-md">
              {badge}
            </span>
          </div>
        )}

        {/* Property Type Badge */}
        <div className="absolute bottom-3 left-3">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-semibold rounded-full shadow-md">
            {type}
          </span>
        </div>

        {freeCancellation && (
          <div className="absolute bottom-3 right-3">
            <span className="px-3 py-1 bg-emerald-500/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full shadow-md">
              Free Cancellation
            </span>
          </div>
        )}
      </div>

      <div className="px-1 pb-4">
        <div className="flex items-start justify-between mb-1.5">
          <h3 className="2xl:text-xl md:text-base text-sm font-bold text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-2 flex-1 mr-3">
            {title}
          </h3>
          <div className="flex items-baseline shrink-0">
            <span className="text-xl font-bold text-green-600">${price}</span>
            <span className="text-xs text-gray-500 ml-1">/ night</span>
          </div>
        </div>

        <div className="flex items-center text-xs text-gray-500 mb-2">
          <span className="truncate">{location}</span>
          <span className="mx-1.5">•</span>
          <span className="truncate">{distance}</span>
        </div>

        {rating != null && (
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(rating)
                      ? "fill-amber-400 text-amber-400"
                      : "fill-gray-200 text-gray-200"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-semibold text-gray-700">
              {rating.toFixed(1)}
            </span>
            {reviewCount != null && (
              <span className="text-xs text-gray-400">
                ({reviewCount.toLocaleString()} reviews)
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VacationCard;
