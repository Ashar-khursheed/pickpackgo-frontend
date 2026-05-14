"use client";
import { useState } from "react";

interface FaqItem {
  q: string;
  a: string;
}

export default function FaqAccordion({ faqs }: { faqs: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function toggle(i: number) {
    setOpenIndex((prev) => (prev === i ? null : i));
  }

  return (
    <div className="divide-y divide-gray-100 border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
      {faqs.map(({ q, a }, i) => (
        <div key={q} className="bg-white">
          <button
            type="button"
            onClick={() => toggle(i)}
            className="flex items-center justify-between w-full px-6 py-5 text-left cursor-pointer"
          >
            <span className="font-semibold text-[#0d1637] md:text-base text-sm pr-4">
              {q}
            </span>
            <span
              style={{
                display: "inline-block",
                transform: openIndex === i ? "rotate(45deg)" : "rotate(0deg)",
                transition: "transform 0.3s ease",
                color: "#16A34A",
                fontSize: "1.25rem",
                fontWeight: 300,
                flexShrink: 0,
              }}
            >
              +
            </span>
          </button>
          <div
            style={{
              display: openIndex === i ? "block" : "none",
            }}
            className="px-6 pb-5 text-[#475569] text-sm md:text-base leading-relaxed"
          >
            {a}
          </div>
        </div>
      ))}
    </div>
  );
}
