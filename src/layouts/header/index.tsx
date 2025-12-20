import Image from "next/image";
import React from "react";
import Logo from "@/assets/logo.svg";
import { navlink } from "@/utils/mock-data";
import { Globe } from "@/utils/icon";
import Link from "next/link";
import { Button } from "@/components/ui/button";
const Header = () => {
  return (
    <>
      <section>
        <div className="global-container">
          <header className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <Image src={Logo} alt="PikPakGo Logo" className="w-32 h-auto" />
              </div>
              <div>
                <nav className="text-white">
                  <ul className="flex space-x-6">
                    {navlink.map((link) => (
                      <li key={link.name}>
                        <Link href={link.href} className="md:text-[17px] text-[14px] font-medium ">
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-4">
                  <h4 className="text-white text-[18px] font-normal">Become a Host</h4>
                  <Globe />
                </div>
                <div>
                  <Link href="#" className="md:text-[17px] text-[14px] font-medium text-white">
                    Login
                  </Link>

                  <Button className="ml-4 bg-[#16A34A] text-white hover:bg-[#16A34A] rounded-md">
                    Sign Up
                  </Button>
                </div>
              </div>
            </div>
          </header>
        </div>
      </section>
    </>
  );
};

export default Header;
