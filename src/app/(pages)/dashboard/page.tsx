"use client";

import { useFormik } from "formik";
import {
  BookOpen,
  CalendarDays,
  ChevronRight,
  Globe,
  LogOut,
  MapPin,
  Phone,
  Save,
  Settings,
  User,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Header from "@/layouts/header";
import { apiurl } from "@/network-request/apis";
import makeApiRequest from "@/network-request/axios";
import { notify } from "@/utils";

interface UserData {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  country?: string;
  city?: string;
  state?: string;
  address?: string;
  date_of_birth?: string;
  gender?: string;
  preferred_currency?: string;
  preferred_language?: string;
}

const TABS = [
  { id: "profile", label: "Edit Profile", icon: User },
  { id: "bookings", label: "My Bookings", icon: BookOpen },
  { id: "settings", label: "Settings", icon: Settings },
];

const profileSchema = Yup.object({
  first_name: Yup.string().min(2).max(50).required("First name is required"),
  last_name: Yup.string().min(2).max(50).required("Last name is required"),
  phone: Yup.string().max(20),
  country: Yup.string().max(100),
  city: Yup.string().max(100),
  state: Yup.string().max(100),
  address: Yup.string().max(255),
  date_of_birth: Yup.string(),
  gender: Yup.string().oneOf(["male", "female", "other", ""]),
  preferred_currency: Yup.string().max(10),
  preferred_language: Yup.string().max(10),
});

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<UserData | null>(null);
  const [activeTab, setActiveTab] = useState(
    searchParams.get("tab") ?? "profile",
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }
    if (savedUser) setUser(JSON.parse(savedUser));
  }, [router]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      first_name: user?.first_name ?? "",
      last_name: user?.last_name ?? "",
      phone: user?.phone ?? "",
      country: user?.country ?? "",
      city: user?.city ?? "",
      state: user?.state ?? "",
      address: user?.address ?? "",
      date_of_birth: user?.date_of_birth ?? "",
      gender: user?.gender ?? "",
      preferred_currency: user?.preferred_currency ?? "USD",
      preferred_language: user?.preferred_language ?? "en",
    },
    validationSchema: profileSchema,
    onSubmit: async (values) => {
      setSaving(true);
      try {
        const _res = await makeApiRequest(apiurl.updateProfile, {
          method: "PUT",
          data: values,
        });
        const updated = { ...user, ...values, email: user?.email };
        localStorage.setItem("user", JSON.stringify(updated));
        setUser(updated as UserData);
        notify({ message: "Profile updated successfully!", type: "success" });
      } catch {
        // error toast handled by interceptor
      } finally {
        setSaving(false);
      }
    },
  });

  const getInitials = () => {
    if (!user) return "U";
    return `${user.first_name?.[0] ?? ""}${user.last_name?.[0] ?? ""}`.toUpperCase();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.replace("/");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="global-container">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar */}
            <aside className="lg:w-72 shrink-0">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* User card */}
                <div className="bg-linear-to-br from-emerald-600 to-emerald-700 p-6 text-white">
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold mb-3">
                    {getInitials()}
                  </div>
                  <p className="font-semibold text-lg leading-tight">
                    {user.first_name} {user.last_name}
                  </p>
                  <p className="text-emerald-100 text-sm mt-0.5 truncate">
                    {user.email}
                  </p>
                </div>

                {/* Nav tabs */}
                <nav className="p-3">
                  {TABS.map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => setActiveTab(id)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl mb-1 transition-all text-left ${
                        activeTab === id
                          ? "bg-emerald-50 text-emerald-700 font-semibold"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <Icon className="w-4 h-4" />
                        {label}
                      </span>
                      <ChevronRight
                        className={`w-4 h-4 transition-transform ${activeTab === id ? "rotate-90" : ""}`}
                      />
                    </button>
                  ))}

                  <div className="border-t border-gray-100 mt-2 pt-2">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm font-medium">Log Out</span>
                    </button>
                  </div>
                </nav>
              </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 min-w-0">
              {/* Edit Profile Tab */}
              {activeTab === "profile" && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-1">
                    Edit Profile
                  </h2>
                  <p className="text-sm text-gray-500 mb-6">
                    Update your personal information
                  </p>

                  <form onSubmit={formik.handleSubmit} noValidate>
                    {/* Name row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label
                          htmlFor="first_name"
                          className="text-sm font-medium text-gray-700 mb-1.5 block"
                        >
                          First Name
                        </Label>
                        <Input
                          id="first_name"
                          name="first_name"
                          value={formik.values.first_name}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          placeholder="First name"
                          className={
                            formik.touched.first_name &&
                            formik.errors.first_name
                              ? "border-red-400"
                              : ""
                          }
                        />
                        {formik.touched.first_name &&
                          formik.errors.first_name && (
                            <p className="text-xs text-red-500 mt-1">
                              {formik.errors.first_name}
                            </p>
                          )}
                      </div>
                      <div>
                        <Label
                          htmlFor="last_name"
                          className="text-sm font-medium text-gray-700 mb-1.5 block"
                        >
                          Last Name
                        </Label>
                        <Input
                          id="last_name"
                          name="last_name"
                          value={formik.values.last_name}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          placeholder="Last name"
                          className={
                            formik.touched.last_name && formik.errors.last_name
                              ? "border-red-400"
                              : ""
                          }
                        />
                        {formik.touched.last_name &&
                          formik.errors.last_name && (
                            <p className="text-xs text-red-500 mt-1">
                              {formik.errors.last_name}
                            </p>
                          )}
                      </div>
                    </div>

                    {/* Phone + DOB */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label
                          htmlFor="phone"
                          className="text-sm font-medium text-gray-700 mb-1.5 block"
                        >
                          <span className="flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5" /> Phone
                          </span>
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formik.values.phone}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          placeholder="+1 555 000 0000"
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor="date_of_birth"
                          className="text-sm font-medium text-gray-700 mb-1.5 block"
                        >
                          <span className="flex items-center gap-1.5">
                            <CalendarDays className="w-3.5 h-3.5" /> Date of
                            Birth
                          </span>
                        </Label>
                        <Input
                          id="date_of_birth"
                          name="date_of_birth"
                          type="date"
                          value={formik.values.date_of_birth}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                      </div>
                    </div>

                    {/* Gender */}
                    <div className="mb-4">
                      <Label
                        htmlFor="gender"
                        className="text-sm font-medium text-gray-700 mb-1.5 block"
                      >
                        Gender
                      </Label>
                      <select
                        id="gender"
                        name="gender"
                        value={formik.values.gender}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    {/* Address section */}
                    <div className="border-t border-gray-100 pt-5 mb-4">
                      <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600" />{" "}
                        Address
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                        <div>
                          <Label
                            htmlFor="country"
                            className="text-sm font-medium text-gray-700 mb-1.5 block"
                          >
                            Country
                          </Label>
                          <Input
                            id="country"
                            name="country"
                            value={formik.values.country}
                            onChange={formik.handleChange}
                            placeholder="Country"
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor="state"
                            className="text-sm font-medium text-gray-700 mb-1.5 block"
                          >
                            State
                          </Label>
                          <Input
                            id="state"
                            name="state"
                            value={formik.values.state}
                            onChange={formik.handleChange}
                            placeholder="State"
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor="city"
                            className="text-sm font-medium text-gray-700 mb-1.5 block"
                          >
                            City
                          </Label>
                          <Input
                            id="city"
                            name="city"
                            value={formik.values.city}
                            onChange={formik.handleChange}
                            placeholder="City"
                          />
                        </div>
                      </div>
                      <div>
                        <Label
                          htmlFor="address"
                          className="text-sm font-medium text-gray-700 mb-1.5 block"
                        >
                          Street Address
                        </Label>
                        <Input
                          id="address"
                          name="address"
                          value={formik.values.address}
                          onChange={formik.handleChange}
                          placeholder="Street address"
                        />
                      </div>
                    </div>

                    {/* Preferences */}
                    <div className="border-t border-gray-100 pt-5 mb-6">
                      <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-emerald-600" />{" "}
                        Preferences
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label
                            htmlFor="preferred_currency"
                            className="text-sm font-medium text-gray-700 mb-1.5 block"
                          >
                            Preferred Currency
                          </Label>
                          <select
                            id="preferred_currency"
                            name="preferred_currency"
                            value={formik.values.preferred_currency}
                            onChange={formik.handleChange}
                            disabled
                            className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                          >
                            <option value="USD">USD — US Dollar</option>
                            <option value="EUR">EUR — Euro</option>
                            <option value="GBP">GBP — British Pound</option>
                            <option value="AED">AED — UAE Dirham</option>
                            <option value="INR">INR — Indian Rupee</option>
                            <option value="SAR">SAR — Saudi Riyal</option>
                          </select>
                        </div>
                        <div>
                          <Label
                            htmlFor="preferred_language"
                            className="text-sm font-medium text-gray-700 mb-1.5 block"
                          >
                            Preferred Language
                          </Label>
                          <select
                            id="preferred_language"
                            name="preferred_language"
                            value={formik.values.preferred_language}
                            onChange={formik.handleChange}
                            disabled
                            className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                          >
                            <option value="en">English</option>
                            <option value="ar">Arabic</option>
                            <option value="fr">French</option>
                            <option value="de">German</option>
                            <option value="es">Spanish</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={saving || !formik.dirty}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 h-10 rounded-lg shadow-sm disabled:opacity-60"
                    >
                      {saving ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Saving...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Save className="w-4 h-4" />
                          Save Changes
                        </span>
                      )}
                    </Button>
                  </form>
                </div>
              )}

              {/* Bookings Tab */}
              {activeTab === "bookings" && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-1">
                    My Bookings
                  </h2>
                  <p className="text-sm text-gray-500 mb-8">
                    View and manage your travel bookings
                  </p>
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
                      <BookOpen className="w-8 h-8 text-emerald-600" />
                    </div>
                    <p className="text-gray-700 font-semibold mb-1">
                      No bookings yet
                    </p>
                    <p className="text-gray-400 text-sm">
                      Your upcoming trips will appear here
                    </p>
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === "settings" && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-1">
                    Settings
                  </h2>
                  <p className="text-sm text-gray-500 mb-8">
                    Manage your account preferences and security
                  </p>
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4">
                      <Settings className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-700 font-semibold mb-1">
                      Coming soon
                    </p>
                    <p className="text-gray-400 text-sm">
                      Account settings will be available shortly
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
