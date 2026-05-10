// import Image from "next/image";
// import React from "react";
// import Logo from "@/assets/logo.svg";
// import { navlink } from "@/utils/mock-data";
// import { Globe } from "@/utils/icon";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import {
//   Sheet,
//   SheetContent,
//   SheetDescription,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from "@/components/ui/sheet"
// const Header = () => {
//   return (
//     <>
//       <section>
//         <div className="global-container">
//           <header className="py-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <Image src={Logo} alt="PikPakGo Logo" className="w-32 h-auto" />
//               </div>
//               <div>
//                 <nav className="text-white">
//                   <ul className="flex space-x-6">
//                     {navlink.map((link) => (
//                       <li key={link.name}>
//                         <Link
//                           href={link.href}
//                           className="md:text-[17px] text-[14px] font-medium "
//                         >
//                           {link.name}
//                         </Link>
//                       </li>
//                     ))}
//                   </ul>
//                 </nav>
//               </div>
//               <div className="flex items-center gap-6">
//                 <div className="flex items-center gap-4">
//                   <h4 className="text-white text-[18px] font-normal">
//                     Become a Host
//                   </h4>
//                   <Globe />
//                 </div>
//                 <div>
//                   <Link
//                     href="#"
//                     className="md:text-[17px] text-[14px] font-medium text-white"
//                   >
//                     Login
//                   </Link>

//                   <Button className="ml-4 bg-[#16A34A] text-white hover:bg-[#16A34A] rounded-md">
//                     Sign Up
//                   </Button>
//                 </div>
//               </div>

//             </div>
//           </header>
//         </div>
//       </section>
//     </>
//   );
// };

// export default Header;

// "use client";

// import Image from "next/image";
// import React from "react";
// import Logo from "@/assets/logo.svg";
// import { navlink } from "@/utils/mock-data";
// import { Globe } from "@/utils/icon";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import {
//   Sheet,
//   SheetContent,
//   SheetTrigger,
// } from "@/components/ui/sheet";
// import { Menu, X, ChevronRight, ChevronDown, LogOut, Settings, Moon, UserCircle2 } from "lucide-react";
// import { cn } from "@/lib/utils";

// const Header = () => {
//   const [isOpen, setIsOpen] = React.useState(false);
//   const [scrolled, setScrolled] = React.useState(false);

//   React.useEffect(() => {
//     const handleScroll = () => {
//       setScrolled(window.scrollY > 10);
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   return (
//     <section
//       className={cn(
//         "sticky top-0 z-50 transition-all duration-300",
//         scrolled && " backdrop-blur-md shadow-lg"
//       )}
//     >
//       <div className="global-container">
//         <header className="py-4 md:py-6">
//           <div className="flex items-center justify-between">
//             {/* Logo */}
//             <div className="z-50">
//               <Link href="/" className="block">
//                 <Image
//                   src={Logo}
//                   alt="PikPakGo Logo"
//                   className="w-24 md:w-32 h-auto transition-all"
//                   priority
//                 />
//               </Link>
//             </div>

//             {/* Desktop Navigation */}
//             <nav className="hidden lg:block text-white">
//               <ul className="flex space-x-8">
//                 {navlink.map((link) => (
//                   <li key={link.name}>
//                     <Link
//                       href={link.href}
//                       className="text-[17px] font-medium hover:text-[#16A34A] transition-colors relative group"
//                     >
//                       {link.name}
//                       <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#16A34A] group-hover:w-full transition-all duration-300" />
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             </nav>

//             {/* Desktop Right Section */}
//             <div className="hidden lg:flex items-center gap-6">
//               <div className="flex items-center gap-4">
//                 <Link
//                   href="/become-host"
//                   className="text-white text-[17px] font-normal hover:text-[#16A34A] transition-colors"
//                 >
//                   Become a Host
//                 </Link>
//                 <button
//                   className="text-white hover:text-[#16A34A] transition-colors p-2 hover:bg-white/5 rounded-lg"
//                   aria-label="Change language"
//                 >
//                   <Globe />
//                 </button>
//               </div>
//               <div className="flex items-center gap-4">
//                 <Link
//                   href="/login"
//                   className="text-[17px] font-medium text-white hover:text-[#16A34A] transition-colors"
//                 >
//                   Login
//                 </Link>
//                 <Link href="/signup">
//                   <Button className="bg-[#16A34A] text-white hover:bg-[#15803d] rounded-md px-6 shadow-lg shadow-[#16A34A]/20">
//                     Sign Up
//                   </Button>
//                 </Link>
//               </div>
//             </div>

//             {/* Mobile Menu Button */}
//             <div className="lg:hidden">
//               <Sheet open={isOpen} onOpenChange={setIsOpen}>
//                 <SheetTrigger asChild>
//                   <button
//                     className="text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
//                     aria-label="Toggle menu"
//                   >
//                     {isOpen ? (
//                       <X className="h-6 w-6 text-white" />
//                     ) : (
//                       <Menu className="h-6 w-6" />
//                     )}
//                   </button>
//                 </SheetTrigger>
//                 <SheetContent
//                   side="right"
//                   className="w-[85vw] sm:w-[400px] bg-[#0f1c2e] border-l border-white/10 p-0"
//                 >
//                   <div className="flex flex-col h-full p-6">
//                     {/* Mobile Header */}
//                     <div className="mb-8 pb-6 border-b border-white/10 flex items-center justify-between">
//                       <Image
//                         src={Logo}
//                         alt="PikPakGo Logo"
//                         className="w-28 h-auto"
//                       />
//                       <X className="h-6 w-6 text-white" onClick={() => setIsOpen(false)} />
//                     </div>

//                     <div>

//                     </div>

//                     {/* Mobile Navigation */}
//                     <nav className="flex-1 overflow-y-auto">
//                       <ul className="space-y-2">
//                         {navlink.map((link, index) => (
//                           <li
//                             key={link.name}
//                             style={{
//                               animation: `slideIn 0.3s ease-out ${index * 0.1}s both`
//                             }}
//                           >
//                             <Link
//                               href={link.href}
//                               onClick={() => setIsOpen(false)}
//                               className="flex items-center justify-between text-white text-lg font-medium py-3 px-4 rounded-lg hover:bg-white/5 transition-all group"
//                             >
//                               <span>{link.name}</span>
//                               <ChevronRight className="h-5 w-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
//                             </Link>
//                           </li>
//                         ))}
//                         <li className="pt-4">
//                           <Link
//                             href="/become-host"
//                             onClick={() => setIsOpen(false)}
//                             className="flex items-center justify-between text-white text-lg font-medium py-3 px-4 rounded-lg hover:bg-white/5 transition-all group"
//                           >
//                             <span>Become a Host</span>
//                             <ChevronRight className="h-5 w-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
//                           </Link>
//                         </li>
//                       </ul>
//                     </nav>

//                     {/* Mobile Bottom Section */}
//                     <div className="space-y-4 pt-6 border-t border-white/10">
//                       <button
//                         className="flex items-center gap-3 w-full py-3 px-4 rounded-lg hover:bg-white/5 transition-colors"
//                         aria-label="Change language"
//                       >
//                         <Globe />
//                         <span className="text-white text-sm">English (US)</span>
//                       </button>
//                       <div className="flex flex-col gap-3">
//                         <Link
//                           href="/login"
//                           onClick={() => setIsOpen(false)}
//                         >
//                           <Button
//                             variant="outline"
//                             className="w-full border-white/20 text-black hover:bg-white/10 h-12"
//                           >
//                             Login
//                           </Button>
//                         </Link>
//                         <Link
//                           href="/signup"
//                           onClick={() => setIsOpen(false)}
//                         >
//                           <Button className="w-full bg-[#16A34A] text-white hover:bg-[#15803d] h-12 shadow-lg shadow-[#16A34A]/20">
//                             Sign Up
//                           </Button>
//                         </Link>
//                       </div>
//                     </div>
//                   </div>
//                 </SheetContent>
//               </Sheet>
//             </div>
//           </div>
//         </header>
//       </div>

//       <style jsx global>{`
//         @keyframes slideIn {
//           from {
//             opacity: 0;
//             transform: translateX(20px);
//           }
//           to {
//             opacity: 1;
//             transform: translateX(0);
//           }
//         }
//       `}</style>
//     </section>
//   );
// };

// export default Header;

"use client";

import Image from "next/image";
import React from "react";
import Logo from "@/assets/logo.svg";
import { navlink } from "@/utils/mock-data";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  LogOut,
  Settings,
  Moon,
  UserCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import BlackLogo from "@/assets/black-logo.svg";
import { Modal } from "@/components/ui/modal";
import ModalAuthForm from "../auth/auth-form";
import makeApiRequest from "@/network-request/axios";
import { apiurl } from "@/network-request/apis";
import { notify } from "@/utils";
const Header = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [isModal, setIsModal] = React.useState({
    loginModal: false,
    signupModal: false,
    agencyModal: false,
  });
  const [user, setUser] = React.useState<any>(null);
  const [token, setToken] = React.useState<string | null>(null);
  const [mounted, setMounted] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [loggingOut, setLoggingOut] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  const isHomePage = pathname === "/";

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  React.useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (savedToken) setToken(savedToken);
    if (savedUser) setUser(JSON.parse(savedUser));
    setMounted(true);
  }, []);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAuthSuccess = () => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (savedToken) setToken(savedToken);
    if (savedUser) setUser(JSON.parse(savedUser));
    setIsModal({ loginModal: false, signupModal: false });
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await makeApiRequest(apiurl.logout, { method: "POST" });
    } catch (_) {
    } finally {
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

  return (
    <>
      <section
        className={cn(
          "sticky top-0 z-50 transition-all duration-300",
          scrolled && "backdrop-blur-md bg-black/45 shadow-lg",
          !isHomePage && "bg-[#fff] shadow-md",
        )}
      >
        <div className="global-container">
          <header className="py-4 md:py-6">
            <div className="flex items-center justify-between">
              {/* Logo - Changes based on page */}
              <div className="z-50">
                <Link href="/" className="block">
                  <Image
                    src={isHomePage ? Logo : BlackLogo}
                    alt="PikPakGo Logo"
                    className="w-24 md:w-32 h-auto transition-all"
                    priority
                  />
                </Link>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden lg:block">
                <ul className="flex space-x-8">
                  {navlink.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className={`text-[17px] font-medium ${isHomePage ? 'text-[#fff]' : 'text-[#0d1637]'} hover:text-emerald-400 transition-colors relative group`}
                        // className="text-[17px] font-medium text-[#0d1637] hover:text-emerald-400 transition-colors relative group"
                      >
                        {link.name}
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-400 group-hover:w-full transition-all duration-300" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Desktop Right Section */}
              <div className="hidden lg:flex items-center gap-6">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setIsModal({ ...isModal, agencyModal: true })}
                    className={`text-[17px] font-normal ${isHomePage ? 'text-[#fff]' : 'text-[#0d1637]'} hover:text-emerald-400 transition-colors`}
                  >
                    Become a Host
                  </button>
                  {/* <button
                    className="text-[#0d1637] hover:text-emerald-400 hover:bg-[#0d1637]/5 transition-colors p-2 rounded-lg"
                    aria-label="Change language"
                  >
                    <Globe   />
                  </button> */}
                </div>
                <div className="flex items-center gap-4">
                  {token ? (
                    <div className="relative" ref={dropdownRef}>
                      <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex cursor-pointer items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 hover:shadow-md transition-all bg-white"
                      >
                        <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white text-sm font-bold">
                          {getInitials(user)}
                        </div>
                        <span className="text-gray-800 text-sm font-medium max-w-[100px] truncate">
                          {user.first_name} {user.last_name}
                        </span>
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      </button>

                      {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-[9999]">
                          {/* User info */}
                          <div className="px-4 py-3 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold">
                                {getInitials(user)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 truncate">
                                  {user.first_name} {user.last_name}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                  {user.email}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 mt-2">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                              <span className="text-xs text-emerald-600 font-medium">
                                Online
                              </span>
                            </div>
                          </div>

                          {/* Menu items */}
                          <div className="py-1">
                            <button
                              onClick={() => { setDropdownOpen(false); router.push('/dashboard'); }}
                              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
                            >
                              <UserCircle2 className="w-4 h-4 text-gray-500" />
                              <div>
                                <p className="text-sm font-medium text-gray-800">
                                  My Profile
                                </p>
                                <p className="text-xs text-gray-400">
                                  View &amp; edit profile
                                </p>
                              </div>
                            </button>
                            <button
                              onClick={() => { setDropdownOpen(false); router.push('/dashboard?tab=settings'); }}
                              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
                            >
                              <Settings className="w-4 h-4 text-gray-500" />
                              <div>
                                <p className="text-sm font-medium text-gray-800">
                                  Settings
                                </p>
                                <p className="text-xs text-gray-400">
                                  Preferences &amp; security
                                </p>
                              </div>
                            </button>
                            <button className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left">
                              <Moon className="w-4 h-4 text-gray-500" />
                              <div>
                                <p className="text-sm font-medium text-gray-800">
                                  Dark Mode
                                </p>
                                <p className="text-xs text-gray-400">
                                  Toggle theme
                                </p>
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
                                  {loggingOut
                                    ? `Logging out ${user?.first_name ?? ""}...`
                                    : `Log Out ${user?.first_name ?? ""}`}
                                </p>
                                <p className="text-xs text-red-400">
                                  End your session
                                </p>
                              </div>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      <Button
                        className="text-[17px] font-medium bg-transparent hover:bg-white/10 text-white transition-colors border border-white/30"
                        onClick={() =>
                          setIsModal({ ...isModal, loginModal: true })
                        }
                      >
                        Login
                      </Button>
                      <Button
                        className="bg-emerald-600 text-white hover:bg-emerald-700 rounded-md px-6 shadow-lg shadow-emerald-600/20"
                        onClick={() =>
                          setIsModal({ ...isModal, signupModal: true })
                        }
                      >
                        Sign Up
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Mobile Menu Button */}
              <div className="lg:hidden">
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                  <SheetTrigger asChild>
                    <button
                      className="p-2 rounded-lg transition-colors text-[#0d1637] hover:bg-white/10"
                      aria-label="Toggle menu"
                    >
                      {isOpen ? (
                        <X className="h-6 w-6 text-[#0d1637]" />
                      ) : (
                        <Menu className={`h-6 w-6 ${isHomePage ? 'text-white' : 'text-[#0d1637]'}`}  />
                      )}
                    </button>
                  </SheetTrigger>
                  <SheetContent
                    side="right"
                    className="w-[85vw] sm:w-[400px] bg-[#0d1637] border-l border-white/10 p-0"
                  >
                    <div className="flex flex-col h-full p-6">
                      {/* Mobile Header */}
                      <div className="mb-8 pb-6 border-b border-white/10 flex items-center justify-between">
                        <Image
                          src={Logo}
                          alt="PikPakGo Logo"
                          className="w-28 h-auto"
                        />
                        <button
                          onClick={() => setIsOpen(false)}
                          className="text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
                        >
                          <X className="h-6 w-6" />
                        </button>
                      </div>

                      {/* Mobile Navigation */}
                      <nav className="flex-1 overflow-y-auto">
                        <ul className="space-y-2">
                          {navlink.map((link, index) => (
                            <li
                              key={link.name}
                              style={{
                                animation: `slideIn 0.3s ease-out ${
                                  index * 0.1
                                }s both`,
                              }}
                            >
                              <Link
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                className="flex items-center justify-between text-white text-lg font-medium py-3 px-4 rounded-lg hover:bg-white/5 transition-all group"
                              >
                                <span>{link.name}</span>
                                <ChevronRight className="h-5 w-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                              </Link>
                            </li>
                          ))}
                          <li className="pt-4">
                            <button
                              onClick={() => { setIsOpen(false); setIsModal({ ...isModal, agencyModal: true }); }}
                              className="w-full flex items-center justify-between text-white text-lg font-medium py-3 px-4 rounded-lg hover:bg-white/5 transition-all group"
                            >
                              <span>Become a Host</span>
                              <ChevronRight className="h-5 w-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                            </button>
                          </li>
                        </ul>
                      </nav>

                      {/* Mobile Bottom Section */}
                      <div className="pt-6 border-t border-white/10">
                        {mounted && token ? (
                          <div className="space-y-2.5">
                            {/* Profile Card */}
                            <div className="bg-white/10 rounded-2xl p-4 mb-1">
                              <div className="flex items-center gap-3 mb-3">
                                <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-white text-lg font-bold shrink-0 ring-2 ring-emerald-400/40">
                                  {getInitials(user)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-white font-semibold truncate text-sm">
                                    {user?.first_name} {user?.last_name}
                                  </p>
                                  <p className="text-white/50 text-xs truncate mt-0.5">
                                    {user?.email}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
                                <span className="text-emerald-400 text-xs font-medium">Online</span>
                              </div>
                            </div>

                            {/* My Profile */}
                            <button
                              onClick={() => { setIsOpen(false); router.push("/dashboard"); }}
                              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-left"
                            >
                              <UserCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                              <span className="text-white text-sm font-medium flex-1">My Profile</span>
                              <ChevronRight className="w-4 h-4 text-white/40" />
                            </button>

                            {/* Settings */}
                            <button
                              onClick={() => { setIsOpen(false); router.push("/dashboard?tab=settings"); }}
                              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-left"
                            >
                              <Settings className="w-5 h-5 text-emerald-400 shrink-0" />
                              <span className="text-white text-sm font-medium flex-1">Settings</span>
                              <ChevronRight className="w-4 h-4 text-white/40" />
                            </button>

                            {/* Logout */}
                            <button
                              onClick={handleLogout}
                              disabled={loggingOut}
                              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/15 hover:bg-red-500/25 transition-colors text-left disabled:opacity-60"
                            >
                              {loggingOut ? (
                                <div className="w-5 h-5 border-2 border-red-400 border-t-transparent rounded-full animate-spin shrink-0" />
                              ) : (
                                <LogOut className="w-5 h-5 text-red-400 shrink-0" />
                              )}
                              <span className="text-red-400 text-sm font-medium">
                                {loggingOut ? "Logging out..." : "Log Out"}
                              </span>
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-3">
                            <Button
                              variant="outline"
                              className="w-full border-white/30 text-white bg-transparent hover:bg-white/10 h-12"
                              onClick={() => { setIsOpen(false); setIsModal({ ...isModal, loginModal: true }); }}
                            >
                              Login
                            </Button>
                            <Button
                              className="w-full bg-emerald-600 text-white hover:bg-emerald-700 h-12 shadow-lg shadow-emerald-600/20"
                              onClick={() => { setIsOpen(false); setIsModal({ ...isModal, signupModal: true }); }}
                            >
                              Sign Up
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </header>
        </div>

        <style jsx global>{`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateX(20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
        `}</style>
      </section>
      <Modal
        isOpen={isModal.loginModal}
        onClose={() => setIsModal({ ...isModal, loginModal: false })}
        title="Login"
        width="max-w-[600px]"
        showFooter={false}
      >
        <ModalAuthForm
          mode="login"
          onSuccess={handleAuthSuccess}
          onToggleMode={() =>
            setIsModal({ loginModal: false, signupModal: true })
          }
        />
      </Modal>

      <Modal
        isOpen={isModal.signupModal}
        onClose={() => setIsModal({ ...isModal, signupModal: false })}
        title="Sign Up"
        width="max-w-[560px]"
        showFooter={false}
      >
        <ModalAuthForm
          mode="signup"
          onSuccess={handleAuthSuccess}
          onToggleMode={() =>
            setIsModal({ loginModal: true, signupModal: false })
          }
        />
      </Modal>

      <Modal
        isOpen={isModal.agencyModal}
        onClose={() => setIsModal({ ...isModal, agencyModal: false })}
        title="Become a Host — Agency Registration"
        width="max-w-[600px]"
        showFooter={false}
      >
        <ModalAuthForm
          mode="signup"
          initialProfileType="agency"
          onSuccess={handleAuthSuccess}
          onToggleMode={() =>
            setIsModal({ ...isModal, agencyModal: false, loginModal: true })
          }
        />
      </Modal>
    </>
  );
};

export default Header;
