import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { Providers } from "@/components/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://unfilteredbarbershop.com"),
  title: {
    default: "Unfiltered Barbershop | Premium Barber in Simi Valley, CA",
    template: "%s | Unfiltered Barbershop",
  },
  description:
    "Simi Valley's premier luxury barbershop. Precision fades, beard grooming, hair designs & house calls. 585+ 5-star reviews. Book online today at 1706 Erringer Rd Suite #4.",
  keywords: [
    "best barber in Simi Valley",
    "fade haircut Simi Valley",
    "beard trim Simi Valley",
    "men's haircut Simi Valley",
    "luxury barbershop Simi Valley CA",
    "precision fade Simi Valley",
    "barber near me Simi Valley",
    "hair design Simi Valley",
    "house call barber",
    "Unfiltered Barbershop",
  ],
  authors: [{ name: "Unfiltered Barbershop" }],
  creator: "Unfiltered Barbershop",
  publisher: "Unfiltered Barbershop",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://unfilteredbarbershop.com",
    siteName: "Unfiltered Barbershop",
    title: "Unfiltered Barbershop | Premium Barber in Simi Valley, CA",
    description:
      "Simi Valley's most trusted luxury barbershop. Precision fades, beard grooming & house calls. 585+ 5-star reviews.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Unfiltered Barbershop — Premium Barber in Simi Valley, CA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Unfiltered Barbershop | Premium Barber in Simi Valley, CA",
    description: "Simi Valley's premier luxury barbershop. 585+ 5-star reviews.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HairSalon",
  name: "Unfiltered Barbershop",
  image: "https://unfilteredbarbershop.com/og-image.jpg",
  "@id": "https://unfilteredbarbershop.com",
  url: "https://unfilteredbarbershop.com",
  telephone: "+18055550100",
  address: {
    "@type": "PostalAddress",
    streetAddress: "1706 Erringer Rd Suite #4",
    addressLocality: "Simi Valley",
    addressRegion: "CA",
    postalCode: "93065",
    addressCountry: "US",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 34.2694,
    longitude: -118.7815,
  },
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Sunday", opens: "10:00", closes: "14:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "09:00", closes: "19:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "09:00", closes: "17:00" },
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5.0",
    reviewCount: "585",
  },
  priceRange: "$$",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-[#0A0A0A] text-white`}>
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#111111",
                color: "#fff",
                border: "1px solid #262626",
                borderRadius: "12px",
              },
              success: {
                iconTheme: { primary: "#3B82F6", secondary: "#fff" },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
