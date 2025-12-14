"use client";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CookieConsent from "@/components/GDPR/CookieConsent";
import { LanguageProvider } from "@/contexts/LanguageContext";

import { MantineProvider } from "@mantine/core";

import GlobalLoader from "./GlobalLoader";

export default function ConditionalLayout({ currentUser, children }) {
  const pathname = usePathname();

  // Hide header and footer on auth pages, admin login, and add listing page
  const isAuthPage = pathname?.startsWith("/auth") || pathname?.startsWith("/admin/login");
  const isAddListingPage = pathname === "/listings/new";
  const shouldHideHeaderFooter = isAuthPage || isAddListingPage;

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS theme={{ colorScheme: 'light' }}>
      <LanguageProvider>
        <GlobalLoader />
        {!shouldHideHeaderFooter && <Navbar currentUser={currentUser} />}
        <main role="main">
          {children}
        </main>
        {!shouldHideHeaderFooter && <Footer key="main-footer" />}
        {!shouldHideHeaderFooter && <CookieConsent />}
      </LanguageProvider>
    </MantineProvider>
  );
}

