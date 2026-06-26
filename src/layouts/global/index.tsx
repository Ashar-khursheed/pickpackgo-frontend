import type React from "react";
import { Toaster } from "react-hot-toast";
import Footer from "../footer";

const GlobalLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Toaster position="top-center" />
      {children}
      <Footer />
    </div>
  );
};

export default GlobalLayout;
