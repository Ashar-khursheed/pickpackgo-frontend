"use client";

import { ChevronLeft, ChevronRight, Grid2x2, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Props {
  images: string[];
  name: string;
}

export default function PropertyGallery({ images, name }: Props) {
  const [modalIndex, setModalIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (images.length === 0) {
    return (
      <div className="bg-gray-200 h-72 flex items-center justify-center">
        <span className="text-gray-400">No images available</span>
      </div>
    );
  }

  const openModal = (i: number) => {
    setModalIndex(i);
    setIsModalOpen(true);
  };
  const next = () => setModalIndex((i) => (i + 1) % images.length);
  const prev = () =>
    setModalIndex((i) => (i - 1 + images.length) % images.length);

  // Right-side grid: up to 4 images starting from index 1
  const gridImages = images.slice(1, 5);
  const remaining = images.length - 5; // images beyond first 5

  return (
    <>
      {/* ── Gallery Grid ── */}
      <div className="bg-white">
        <div className="container mx-auto px-4 py-4">
          {/* Mobile: single image with arrows */}
          <div className="relative lg:hidden rounded-xl overflow-hidden h-64 bg-gray-100">
            <img
              src={images[0]}
              alt={name}
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => openModal(0)}
            />
            {images.length > 1 && (
              <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full">
                1 / {images.length}
              </div>
            )}
            <button
              type="button"
              onClick={() => openModal(0)}
              className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-white text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-full shadow"
            >
              <Grid2x2 className="w-3.5 h-3.5" />
              All photos
            </button>
          </div>

          {/* Desktop: main + grid */}
          <div
            className="hidden lg:grid gap-2 rounded-xl overflow-hidden"
            style={{
              gridTemplateColumns: gridImages.length > 0 ? "1fr 1fr" : "1fr",
              height: 480,
            }}
          >
            {/* Main image */}
            <div
              className="relative group cursor-pointer overflow-hidden"
              onClick={() => openModal(0)}
            >
              <img
                src={images[0]}
                alt={name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            {/* Right: 2×2 grid */}
            {gridImages.length > 0 && (
              <div
                className="grid gap-2"
                style={{
                  gridTemplateColumns:
                    gridImages.length >= 2 ? "1fr 1fr" : "1fr",
                  gridTemplateRows: gridImages.length >= 3 ? "1fr 1fr" : "1fr",
                }}
              >
                {gridImages.map((img, i) => {
                  const actualIndex = i + 1;
                  const isLast = i === gridImages.length - 1 && remaining > 0;
                  return (
                    <div
                      key={i}
                      className="relative group cursor-pointer overflow-hidden bg-gray-100"
                      onClick={() => openModal(isLast ? 0 : actualIndex)}
                    >
                      <img
                        src={img}
                        alt={`${name} ${actualIndex + 1}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {isLast && (
                        <div
                          className="absolute inset-0 bg-black/50 flex items-center justify-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            openModal(actualIndex);
                          }}
                        >
                          <span className="text-white font-semibold text-xl">
                            +{remaining} more
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Show all photos button — desktop */}
          {images.length > 1 && (
            <div className="hidden lg:flex justify-end mt-2">
              <button
                type="button"
                onClick={() => openModal(0)}
                className="flex items-center gap-2 bg-white border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold text-sm px-4 py-2 rounded-lg shadow-sm transition-colors"
              >
                <Grid2x2 className="w-4 h-4" />
                Show all {images.length} photos
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Full-screen Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/95 z-50 flex flex-col">
          {/* Top bar */}
          <div className="flex items-center justify-between px-6 py-4">
            <span className="text-white/70 text-sm">
              {modalIndex + 1} / {images.length}
            </span>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Main image */}
          <div className="flex-1 flex items-center justify-center px-16 min-h-0">
            <div className="relative w-full max-w-5xl">
              <img
                src={images[modalIndex]}
                alt={`${name} — ${modalIndex + 1}`}
                className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
              />
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prev}
                    className="absolute -left-12 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6 text-gray-800" />
                  </button>
                  <button
                    type="button"
                    onClick={next}
                    className="absolute -right-12 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow transition-colors"
                  >
                    <ChevronRight className="w-6 h-6 text-gray-800" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div className="flex gap-2 px-6 py-4 overflow-x-auto justify-center">
              {images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setModalIndex(i)}
                  className={cn(
                    "shrink-0 w-16 h-12 rounded-md overflow-hidden border-2 transition-all",
                    i === modalIndex
                      ? "border-white opacity-100"
                      : "border-transparent opacity-50 hover:opacity-80",
                  )}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
