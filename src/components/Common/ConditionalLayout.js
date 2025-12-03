"use client";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CookieConsent from "@/components/GDPR/CookieConsent";
import { LanguageProvider } from "@/contexts/LanguageContext";

import { MantineProvider } from "@mantine/core";

export default function ConditionalLayout({ currentUser, children }) {
  const pathname = usePathname();

  // Hide header and footer on auth pages and admin login
  const isAuthPage = pathname?.startsWith("/auth") || pathname?.startsWith("/admin/login");

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS theme={{ colorScheme: 'light' }}>
      <LanguageProvider>
        {!isAuthPage && <Navbar currentUser={currentUser} />}
        <main role="main">
          {children}
        </main>
        {!isAuthPage && <Footer key="main-footer" />}
        {!isAuthPage && <CookieConsent />}
      </LanguageProvider>
    </MantineProvider>
  );
}

