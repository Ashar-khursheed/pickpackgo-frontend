"use client";

import {
  Check,
  Facebook,
  Link2,
  Linkedin,
  Share2,
  Twitter,
} from "lucide-react";
import { useState } from "react";

export default function ShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareUrls = {
    twitter:
      typeof window !== "undefined"
        ? `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(window.location.href)}`
        : "#",
    facebook:
      typeof window !== "undefined"
        ? `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`
        : "#",
    linkedin:
      typeof window !== "undefined"
        ? `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`
        : "#",
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs">
      <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
        <Share2 className="w-4 h-4 text-emerald-500" />
        Share this Article
      </h3>
      <div className="flex items-center gap-3">
        <a
          href={shareUrls.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 rounded-full bg-slate-50 hover:bg-emerald-50 hover:text-emerald-600 flex items-center justify-center text-slate-500 transition-all duration-300 cursor-pointer border border-slate-100 hover:border-emerald-100 hover:scale-105"
          title="Share on Twitter"
        >
          <Twitter className="w-4 h-4 fill-current" />
        </a>
        <a
          href={shareUrls.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 rounded-full bg-slate-50 hover:bg-emerald-50 hover:text-emerald-600 flex items-center justify-center text-slate-500 transition-all duration-300 cursor-pointer border border-slate-100 hover:border-emerald-100 hover:scale-105"
          title="Share on Facebook"
        >
          <Facebook className="w-4 h-4 fill-current" />
        </a>
        <a
          href={shareUrls.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 rounded-full bg-slate-50 hover:bg-emerald-50 hover:text-emerald-600 flex items-center justify-center text-slate-500 transition-all duration-300 cursor-pointer border border-slate-100 hover:border-emerald-100 hover:scale-105"
          title="Share on LinkedIn"
        >
          <Linkedin className="w-4 h-4 fill-current" />
        </a>
        <button
          onClick={handleCopyLink}
          className="w-10 h-10 rounded-full bg-slate-50 hover:bg-emerald-50 hover:text-emerald-600 flex items-center justify-center text-slate-500 transition-all duration-300 cursor-pointer border border-slate-100 hover:border-emerald-100 hover:scale-105 ml-auto"
          title="Copy Link"
        >
          {copied ? (
            <Check className="w-4 h-4 text-emerald-600" />
          ) : (
            <Link2 className="w-4 h-4" />
          )}
        </button>
      </div>
      {copied && (
        <span className="block text-[11px] text-emerald-600 font-semibold mt-3 animate-fade-in text-right">
          Link copied to clipboard!
        </span>
      )}
    </div>
  );
}
