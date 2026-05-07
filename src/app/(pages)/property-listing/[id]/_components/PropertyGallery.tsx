'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  images: string[];
  name: string;
}

export default function PropertyGallery({ images, name }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (images.length === 0) {
    return (
      <div className="bg-gray-200 h-64 flex items-center justify-center">
        <span className="text-gray-400">No images available</span>
      </div>
    );
  }

  const next = () => setCurrentIndex((i) => (i + 1) % images.length);
  const prev = () => setCurrentIndex((i) => (i - 1 + images.length) % images.length);

  return (
    <>
      <div className="bg-black">
        <div className="container mx-auto px-4 py-4">
          <div className="grid grid-cols-4 gap-2" style={{ maxHeight: 440 }}>
            {/* Main image */}
            <div
              className="col-span-4 lg:col-span-2 lg:row-span-2 relative group cursor-pointer overflow-hidden rounded-lg h-64 lg:h-auto"
              onClick={() => setIsModalOpen(true)}
            >
              <img
                src={images[currentIndex]}
                alt={name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); prev(); }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-800" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); next(); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-800" />
                  </button>
                  <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                    {currentIndex + 1} / {images.length}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnails — desktop only */}
            {images.slice(0, 4).map((img, i) => (
              <div
                key={i}
                className="hidden lg:block relative group cursor-pointer overflow-hidden rounded-lg"
                onClick={() => setCurrentIndex(i)}
              >
                <img
                  src={img}
                  alt={`${name} ${i + 1}`}
                  className={cn(
                    'w-full h-full object-cover transition-transform duration-300 group-hover:scale-105',
                    currentIndex === i && 'ring-2 ring-white ring-inset'
                  )}
                />
                {i === 3 && images.length > 4 && (
                  <div
                    className="absolute inset-0 bg-black/50 flex items-center justify-center"
                    onClick={(e) => { e.stopPropagation(); setIsModalOpen(true); }}
                  >
                    <span className="text-white font-semibold text-lg">+{images.length - 4} more</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Full-screen modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 p-2 rounded-full"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          <div className="relative max-w-5xl w-full">
            <img
              src={images[currentIndex]}
              alt={`${name} — image ${currentIndex + 1}`}
              className="w-full h-auto max-h-[85vh] object-contain rounded-lg"
            />
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow"
                >
                  <ChevronLeft className="w-6 h-6 text-gray-800" />
                </button>
                <button
                  type="button"
                  onClick={next}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow"
                >
                  <ChevronRight className="w-6 h-6 text-gray-800" />
                </button>
              </>
            )}
            <p className="text-center text-white/60 text-sm mt-3">
              {currentIndex + 1} / {images.length}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
