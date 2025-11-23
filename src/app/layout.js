import "./styles/bootstrap.min.css";
import "./styles/flaticon.css";
import "./styles/remixicon.css";
import "./styles/dark-mode.css";
import "./styles/cereal-font.css";
import "swiper/css";
import "swiper/css/pagination";
import "react-accessible-accordion/dist/fancy-example.css";
// Global styles
import "./styles/style.css";
import "./styles/responsive.css";

import ConditionalLayout from "@/components/Common/ConditionalLayout";
import TosterProvider from "@/providers/TosterProvider";
import SessionProvider from "@/providers/SessionProvider";
import { getCurrentUser } from "@/actions/getCurrentUser";
import localFont from "next/font/local";
import { Dancing_Script } from "next/font/google";

export const metadata = {
  title: {
    default: "AmberHomes - Classified Ads & Directory Listing",
    template: "%s | AmberHomes",
  },
  description: "Find the perfect property in Morocco. Browse classified ads for real estate, rentals, and property listings in Marrakech and beyond.",
  keywords: ["real estate", "property listings", "Morocco", "Marrakech", "classified ads", "rentals", "property sales"],
  authors: [{ name: "AmberHomes" }],
  creator: "AmberHomes",
  publisher: "AmberHomes",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://amberhomes-liart.vercel.app/"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://amberhomes-liart.vercel.app/",
    siteName: "AmberHomes",
    title: "AmberHomes - Classified Ads & Directory Listing",
    description: "Find the perfect property in Morocco. Browse classified ads for real estate, rentals, and property listings.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AmberHomes - Property Listings",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AmberHomes - Classified Ads & Directory Listing",
    description: "Find the perfect property in Morocco. Browse classified ads for real estate, rentals, and property listings.",
    images: ["/images/og-image.jpg"],
    creator: "@amberhomes",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: [
    {
      rel: "icon",
      type: "image/x-icon",
      sizes: "32x32",
      url: "/favicon.ico",
    },
    {
      rel: "icon",
      type: "image/x-icon",
      sizes: "16x16",
      url: "/favicon.ico",
    },
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      url: "/favicon.ico",
    },
  ],
};

// Cereal font from local file
const cereal = localFont({
  src: "../../public/fonts/cereal.otf",
  variable: "--font-cereal",
  display: "swap",
  weight: "400",
});

// Brush-style font for hero text
const dancingScript = Dancing_Script({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-brush",
  display: "swap",
});

export default async function RootLayout({ children }) {
  const currentUser = await getCurrentUser();

  return (
    <html lang="en" className={`${cereal.variable} ${dancingScript.variable}`}>
      <body suppressHydrationWarning={true}>
        <SessionProvider>
          <TosterProvider />
          <ConditionalLayout currentUser={currentUser}>
            {children}
          </ConditionalLayout>
        </SessionProvider>
      </body>
    </html>
  );
}
