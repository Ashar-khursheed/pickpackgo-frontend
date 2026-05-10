"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, LogOut, Moon, Settings, UserCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import makeApiRequest from "@/network-request/axios";
import { apiurl } from "@/network-request/apis";
import { notify } from "@/utils";

interface AuthButtonsProps {
  onLoginClick: () => void;
  onSignupClick: () => void;
}

export default function AuthButtons({ onLoginClick, onSignupClick }: AuthButtonsProps) {
  // localStorage synchronously read on first client render — no useEffect, no flash
  const [token, setToken] = React.useState<string | null>(
    () => localStorage.getItem("token")
  );
  const [user, setUser] = React.useState<any>(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [loggingOut, setLoggingOut] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const router = useRouter();

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await makeApiRequest(apiurl.logout, { method: "POST" });
    } catch (_) {}
    finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setToken(null);
      setUser(null);
      setLoggingOut(false);
      setDropdownOpen(false);
      notify({ message: "Logged out successfully.", type: "success" });
    }
  };

  const getInitials = (u: any) => {
    if (!u) return "U";
    return `${u.first_name?.[0] || ""}${u.last_name?.[0] || ""}`.toUpperCase();
  };

  if (!token) {
    return (
      <>
        <Button
          className="text-[17px] font-medium bg-transparent hover:bg-white/10 text-white transition-colors border border-white/30"
          onClick={onLoginClick}
        >
          Login
        </Button>
        <Button
          className="bg-emerald-600 text-white hover:bg-emerald-700 rounded-md px-6 shadow-lg shadow-emerald-600/20"
          onClick={onSignupClick}
        >
          Sign Up
        </Button>
      </>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 hover:shadow-md transition-all bg-white"
      >
        <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white text-sm font-bold">
          {getInitials(user)}
        </div>
        <span className="text-gray-800 text-sm font-medium max-w-[100px] truncate">
          {user?.first_name} {user?.last_name}
        </span>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-[9999]">
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold">
                {getInitials(user)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user?.first_name} {user?.last_name}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              <span className="text-xs text-emerald-600 font-medium">Online</span>
            </div>
          </div>

          <div className="py-1">
            <button
              onClick={() => { setDropdownOpen(false); router.push("/dashboard"); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
            >
              <UserCircle2 className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-800">My Profile</p>
                <p className="text-xs text-gray-400">View &amp; edit profile</p>
              </div>
            </button>
            <button
              onClick={() => { setDropdownOpen(false); router.push("/dashboard?tab=settings"); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
            >
              <Settings className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-800">Settings</p>
                <p className="text-xs text-gray-400">Preferences &amp; security</p>
              </div>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left">
              <Moon className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-800">Dark Mode</p>
                <p className="text-xs text-gray-400">Toggle theme</p>
              </div>
            </button>
          </div>

          <div className="border-t border-gray-100 py-1">
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 transition-colors text-left disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loggingOut ? (
                <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <LogOut className="w-4 h-4 text-red-500" />
              )}
              <div>
                <p className="text-sm font-medium text-red-500">
                  {loggingOut ? `Logging out ${user?.first_name ?? ""}...` : `Log Out ${user?.first_name ?? ""}`}
                </p>
                <p className="text-xs text-red-400">End your session</p>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
