// components/TestimonialCard.tsx
import Image from 'next/image';
import { Star } from 'lucide-react';

interface TestimonialCardProps {
  rating: number;
  testimonial: string;
  name: string;
  title: string;
  image: string;
}

export default function TestimonialCard({
  rating,
  testimonial,
  name,
  title,
  image,
}: TestimonialCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto hover:shadow-xl transition-shadow duration-300">
      {/* Stars */}
      <div className="flex gap-1 mb-6">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            className={`2xl:w-8 2xl:h-8 md:w-5 md:h-5 ${
              index < rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-gray-200 text-gray-200'
            }`}
          />
        ))}
      </div>

      {/* Testimonial Text */}
      <blockquote className="mb-8">
        <p className="text-gray-700 md:text-base 2xl:text-xl text-sm leading-relaxed italic">
          "{testimonial}"
        </p>
      </blockquote>

      {/* User Info */}
      <div className="flex items-center gap-4">
        {/* <div className="relative w-16 h-16 rounded-full overflow-hidden ring-2 ring-gray-200"> */}
          <img
            src={image}
            alt={name}
            // fill
            className="object-cover 2xl:w-14 2xl:h-14 md:w-10 md:h-10 h-5 w-5 rounded-full"
          />
        {/* </div> */}
        <div>
          <h4 className="text-gray-900 font-semibold 2xl:text-lg md:text-base text-sm">{name}</h4>
          <p className="text-gray-500 text-sm">{title}</p>
        </div>
      </div>
    </div>
  );
}