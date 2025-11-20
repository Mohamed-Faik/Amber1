"use client";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function ConditionalLayout({ currentUser, children }) {
  const pathname = usePathname();
  
  // Hide header and footer on auth pages and admin login
  const isAuthPage = pathname?.startsWith("/auth") || pathname?.startsWith("/admin/login");

  return (
    <>
      {!isAuthPage && <Navbar currentUser={currentUser} />}
      {children}
      {!isAuthPage && <Footer />}
    </>
  );
}

