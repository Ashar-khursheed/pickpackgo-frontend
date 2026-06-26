"use client";

import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import makeApiRequest from "@/network-request/axios";
import { notify } from "@/utils";

interface WishlistButtonProps {
  propertyCode: string;
  propertyName?: string;
  propertyType?: string;
  pricePerNight?: number;
  currency?: string;
  imageUrl?: string;
  seoSlug?: string;
  size?: "sm" | "md";
  className?: string;
}

export default function WishlistButton({
  propertyCode,
  propertyName,
  propertyType,
  pricePerNight,
  currency,
  imageUrl,
  seoSlug,
  size = "md",
  className = "",
}: WishlistButtonProps) {
  const [wishlisted, setWishlisted] = useState(false);
  const [loading, setLoading] = useState(false);

  const isLoggedIn = (): boolean => {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("token");
  };

  useEffect(() => {
    if (!isLoggedIn() || !propertyCode) return;
    makeApiRequest(`wishlist/check/${propertyCode}`)
      .then((res) => {
        setWishlisted(res?.data?.in_wishlist ?? false);
      })
      .catch(() => {});
  }, [propertyCode, isLoggedIn]);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn()) {
      notify({
        message: "Please login to save properties to your wishlist.",
        type: "error",
      });
      return;
    }

    setLoading(true);
    try {
      if (wishlisted) {
        await makeApiRequest(`wishlist/${propertyCode}`, { method: "DELETE" });
        setWishlisted(false);
        notify({ message: "Removed from wishlist", type: "success" });
      } else {
        await makeApiRequest("wishlist", {
          method: "POST",
          data: {
            property_code: propertyCode,
            property_name: propertyName,
            property_type: propertyType,
            price_per_night: pricePerNight,
            currency,
            image_url: imageUrl,
            seo_slug: seoSlug,
          },
        });
        setWishlisted(true);
        notify({ message: "Saved to wishlist!", type: "success" });
      }
    } catch {
      // error already handled by makeApiRequest notify
    } finally {
      setLoading(false);
    }
  };

  const btnSize = size === "sm" ? "w-7 h-7" : "w-8 h-8";
  const iconSize = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={loading}
      className={`${btnSize} bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform disabled:opacity-70 ${className}`}
      aria-label={wishlisted ? "Remove from wishlist" : "Save to wishlist"}
    >
      <Heart
        className={`${iconSize} transition-colors ${
          wishlisted ? "fill-red-500 text-red-500" : "text-gray-500"
        }`}
      />
    </button>
  );
}
